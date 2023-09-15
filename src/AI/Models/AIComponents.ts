import { vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";

export class WaypointComponent extends Component
{
    position: vec3 = vec3.create();
    adjWaypointIds: Array<number> = new Array<number>(4);

    applyDefaultValues()
    {
        vec3.set(this.position, 0, 0, 0);
        this.adjWaypointIds.length = 0;
    }
}
ComponentPools["Waypoint"] = new Pool<WaypointComponent>("WaypointComponent", 256, () => new WaypointComponent());

//-----------------------------------------------------------------------

export class PathfinderComponent extends Component
{
    enabled: boolean = undefined;
    destination: vec3 = vec3.create();
    prevWaypointId: number = undefined;
    currWaypointId: number = undefined;
    moveForceStrength: number = undefined;
    stoppingDist: number = undefined;

    applyDefaultValues()
    {
        this.enabled = false;
        vec3.set(this.destination, 0, 0, 0);
        this.prevWaypointId = -1;
        this.currWaypointId = -1;
        this.moveForceStrength = 10;
        this.stoppingDist = 0.75;
    }
}
ComponentPools["Pathfinder"] = new Pool<PathfinderComponent>("PathfinderComponent", 256, () => new PathfinderComponent());

//-----------------------------------------------------------------------