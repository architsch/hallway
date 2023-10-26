import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { WaypointComponent, WaypointTraverserComponent } from "../Models/DynamicComponents";
import { KinematicsComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";
import Random from "../../Util/Math/Random";

export default class WaypointSystem extends System
{
    private toWaypoint: vec3 = vec3.create();
    private forceToAdd: vec3 = vec3.create();

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["WaypointTraverserComponent", ["WaypointTraverserComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        this.queryEntityGroup("WaypointTraverserComponent").forEach((entity: Entity) => {
            const traverser = ecs.getComponent(entity.id, "WaypointTraverserComponent") as WaypointTraverserComponent;
            const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;

            if (traverser.currWaypointEntityId < 0)
                throw new Error(`Waypoint hasn't been initialized yet (Traverser's entityId = ${entity.id}).`);
            
            let waypoint = ecs.getComponent(traverser.currWaypointEntityId, "WaypointComponent") as WaypointComponent;
            this.computeVecToWaypoint(traverser, tr, waypoint);
            let distToWaypoint = vec3.length(this.toWaypoint);

            if (distToWaypoint <= traverser.stoppingDist)
            {
                const w = waypoint.nextWaypointEntityIds;
                let numNextWaypoints = 0;
                if (w[0] >= 0) ++numNextWaypoints;
                if (w[1] >= 0) ++numNextWaypoints;
                if (w[2] >= 0) ++numNextWaypoints;
                if (w[3] >= 0) ++numNextWaypoints;

                if (numNextWaypoints > 0) // There is at least one next waypoint that can be chosen.
                {
                    traverser.currWaypointEntityId = w[Random.randomIntBetween(0, numNextWaypoints)];
                    waypoint = ecs.getComponent(traverser.currWaypointEntityId, "WaypointComponent") as WaypointComponent;
                    this.computeVecToWaypoint(traverser, tr, waypoint);
                    distToWaypoint = vec3.length(this.toWaypoint);
                }
            }
            vec3.scale(this.forceToAdd, this.toWaypoint, traverser.moveForce / (distToWaypoint + 0.001));
            
            if (ecs.hasComponent(entity.id, "KinematicsComponent"))
            {
                const k = ecs.getComponent(entity.id, "KinematicsComponent") as KinematicsComponent;
                vec3.add(k.pendingForce, k.pendingForce, this.forceToAdd);
            }
            else
            {
                vec3.add(tr.position, tr.position, this.forceToAdd);
                tr.matrixSynced = false;
            }
        });
    }

    private computeVecToWaypoint(traverser: WaypointTraverserComponent, tr: TransformComponent, waypoint: WaypointComponent)
    {
        if (traverser.ignoreY)
            vec3.set(this.toWaypoint, waypoint.position[0] - tr.position[0], 0, waypoint.position[2] - tr.position[2]);
        else
            vec3.subtract(this.toWaypoint, waypoint.position, tr.position);
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}