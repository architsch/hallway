import { vec2, vec3 } from "gl-matrix";
import { Component, registerComponent } from "../../ECS/Component";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;

//-----------------------------------------------------------------------
// AfterDelay
//-----------------------------------------------------------------------

export abstract class AfterDelayComponent extends Component
{
    delay: number = undefined;
    startTime: number = undefined;

    applyDefaultValues()
    {
        this.delay = 1;
        this.startTime = undefined;
    }
}

export class DieAfterDelayComponent extends AfterDelayComponent
{
    applyDefaultValues()
    {
        super.applyDefaultValues();
    }
}
registerComponent("DieAfterDelayComponent", () => new DieAfterDelayComponent());

export class SpawnAfterDelayComponent extends AfterDelayComponent
{
    entityToSpawnConfigId: string;
    spawnOffset: vec3 = vec3.create();

    applyDefaultValues()
    {
        super.applyDefaultValues();
        this.entityToSpawnConfigId = undefined;
        vec3.set(this.spawnOffset, 0, 0, 0);
    }
}
registerComponent("SpawnAfterDelayComponent", () => new SpawnAfterDelayComponent());

//-----------------------------------------------------------------------
// OnInterval
//-----------------------------------------------------------------------

export abstract class OnIntervalComponent extends Component
{
    interval: number = undefined;
    startTime: number = undefined;

    applyDefaultValues()
    {
        this.interval = 1;
        this.startTime = undefined;
    }
}

export class SpawnOnIntervalComponent extends OnIntervalComponent
{
    entityToSpawnConfigId: string;
    spawnOffset: vec3 = vec3.create();

    applyDefaultValues()
    {
        super.applyDefaultValues();
        this.entityToSpawnConfigId = undefined;
        vec3.set(this.spawnOffset, 0, 0, 0);
    }
}
registerComponent("SpawnOnIntervalComponent", () => new SpawnOnIntervalComponent());

//-----------------------------------------------------------------------
// OnCollision
//-----------------------------------------------------------------------

export class DieOnCollisionWithRigidbodyComponent extends Component
{
    applyDefaultValues()
    {
    }
}
registerComponent("DieOnCollisionWithRigidbodyComponent", () => new DieOnCollisionWithRigidbodyComponent());

export class SpawnOnCollisionWithRigidbodyComponent extends Component
{
    entityToSpawnConfigId: string;
    spawnOffset: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.entityToSpawnConfigId = undefined;
        vec3.set(this.spawnOffset, 0, 0, 0);
    }
}
registerComponent("SpawnOnCollisionWithRigidbodyComponent", () => new SpawnOnCollisionWithRigidbodyComponent());

//-----------------------------------------------------------------------
// Waypoint
//-----------------------------------------------------------------------

export class WaypointComponent extends Component
{
    nextWaypointEntityIds: [number, number, number, number] = [-1, -1, -1, -1];
    position: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.nextWaypointEntityIds[0] = -1;
        this.nextWaypointEntityIds[1] = -1;
        this.nextWaypointEntityIds[2] = -1;
        this.nextWaypointEntityIds[3] = -1;
        vec3.set(this.position, 0, 0, 0);
    }
}
registerComponent("WaypointComponent", () => new WaypointComponent());

export class WaypointTraverserComponent extends Component
{
    stoppingDist: number = undefined;
    moveForce: number = undefined;
    ignoreY: boolean = undefined;

    // State
    currWaypointEntityId: number = undefined;

    applyDefaultValues()
    {
        this.stoppingDist = 0.5;
        this.moveForce = 5;
        this.ignoreY = true;
        this.currWaypointEntityId = -1;
    }
}
registerComponent("WaypointTraverserComponent", () => new WaypointTraverserComponent());

//-----------------------------------------------------------------------
// Misc
//-----------------------------------------------------------------------