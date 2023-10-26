import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import { WaypointComponent, WaypointTraverserComponent } from "../Models/DynamicComponents";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import Random from "../../Util/Math/Random";

const startWaypointPos: vec3 = vec3.create();
const endWaypointPos: vec3 = vec3.create();
const waypointStep: vec3 = vec3.create();
const waypointPos: vec3 = vec3.create();
const waypointEntityIds: Array<number> = new Array<number>();
const waypoints: Array<WaypointComponent> = new Array<WaypointComponent>();

export default class WaypointFactory
{
    static createPath(ecs: ECSManager,
        startWaypoint: [number, number, number], endWaypoint: [number, number, number],
        numPointsInPath: number, loop: boolean)
    {
        WaypointFactory.reset();

        vec3.set(startWaypointPos, startWaypoint[0], startWaypoint[1], startWaypoint[2]);
        vec3.set(endWaypointPos, endWaypoint[0], endWaypoint[1], endWaypoint[2]);

        vec3.subtract(waypointStep, endWaypointPos, startWaypointPos);
        vec3.scale(waypointStep, waypointStep, 1 / (numPointsInPath-1));

        vec3.copy(waypointPos, startWaypointPos);
        for (let i = 0; i < numPointsInPath; ++i)
        {
            WaypointFactory.registerWaypoint(ecs, waypointPos);
            vec3.add(waypointPos, waypointPos, waypointStep);
        }

        if (loop)
        {
            vec3.copy(waypointPos, endWaypointPos);
            for (let i = 0; i < numPointsInPath; ++i)
            {
                WaypointFactory.registerWaypoint(ecs, waypointPos);
                vec3.subtract(waypointPos, waypointPos, waypointStep);
            }
        }

        for (let i = 0; i < waypointEntityIds.length-1; ++i)
            waypoints[i].nextWaypointEntityIds[0] = waypointEntityIds[i+1];
        if (loop)
            waypoints[waypoints.length-1].nextWaypointEntityIds[0] = waypointEntityIds[0];
    }

    static placeTraverserAtNearestWaypoint(ecs: ECSManager, traverserEntityId: number)
    {
        const traverser = ecs.getComponent(traverserEntityId, "WaypointTraverserComponent") as WaypointTraverserComponent;
        const tr = ecs.getComponent(traverserEntityId, "TransformComponent") as TransformComponent;

        let minDist = 99999;
        let minDistWaypointIndex = 0;
        for (let i = 0; i < waypoints.length; ++i)
        {
            const dist = vec3.distance(waypoints[i].position, tr.position);
            if (dist <= minDist)
            {
                minDist = dist;
                minDistWaypointIndex = i;
            }
        }
        
        const waypointIndex = minDistWaypointIndex;
        const waypoint = waypoints[waypointIndex];
        traverser.currWaypointEntityId = waypointEntityIds[waypointIndex];
        const p = waypoint.position;
        vec3.set(tr.position, p[0], traverser.ignoreY ? tr.position[1] : p[1], p[2]);
        tr.matrixSynced = false;
    }

    static placeTraverserAtRandomWaypoint(ecs: ECSManager, traverserEntityId: number)
    {
        const traverser = ecs.getComponent(traverserEntityId, "WaypointTraverserComponent") as WaypointTraverserComponent;
        const tr = ecs.getComponent(traverserEntityId, "TransformComponent") as TransformComponent;
        
        const waypointIndex = Random.randomIntBetween(0, waypoints.length);
        const waypoint = waypoints[waypointIndex];
        traverser.currWaypointEntityId = waypointEntityIds[waypointIndex];
        const p = waypoint.position;
        vec3.set(tr.position, p[0], traverser.ignoreY ? tr.position[1] : p[1], p[2]);
        tr.matrixSynced = false;
    }

    private static registerWaypoint(ecs: ECSManager, position: vec3)
    {
        const waypointEntity = ecs.addEntity("empty");
        const waypoint = ecs.addComponent(waypointEntity.id, "WaypointComponent") as WaypointComponent;
        vec3.copy(waypoint.position, position);
        waypointEntityIds.push(waypointEntity.id);
        waypoints.push(waypoint);
    }

    private static reset()
    {
        waypointEntityIds.length = 0;
        waypoints.length = 0;
    }
}