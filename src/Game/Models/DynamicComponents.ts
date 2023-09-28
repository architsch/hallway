import { vec2, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
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
ComponentPools["DieAfterDelay"] = new Pool<DieAfterDelayComponent>("DieAfterDelayComponent", g.maxNumEntities, () => new DieAfterDelayComponent());

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
ComponentPools["SpawnAfterDelay"] = new Pool<SpawnAfterDelayComponent>("SpawnAfterDelayComponent", g.maxNumEntities, () => new SpawnAfterDelayComponent());

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
ComponentPools["SpawnOnInterval"] = new Pool<SpawnOnIntervalComponent>("SpawnOnIntervalComponent", g.maxNumEntities, () => new SpawnOnIntervalComponent());

//-----------------------------------------------------------------------
// OnCollision
//-----------------------------------------------------------------------

export abstract class OnCollisionComponent extends Component
{
    myEntityComponentTypeRequired: string = undefined;
    otherEntityComponentTypeRequired: string = undefined;

    applyDefaultValues()
    {
        this.myEntityComponentTypeRequired = undefined;
        this.otherEntityComponentTypeRequired = undefined;
    }
}

export class DieOnCollisionComponent extends OnCollisionComponent
{
    applyDefaultValues()
    {
        super.applyDefaultValues();
    }
}
ComponentPools["DieOnCollision"] = new Pool<DieOnCollisionComponent>("DieOnCollisionComponent", g.maxNumEntities, () => new DieOnCollisionComponent());

export class SpawnOnCollisionComponent extends OnCollisionComponent
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
ComponentPools["SpawnOnCollision"] = new Pool<SpawnOnCollisionComponent>("SpawnOnCollisionComponent", g.maxNumEntities, () => new SpawnOnCollisionComponent());