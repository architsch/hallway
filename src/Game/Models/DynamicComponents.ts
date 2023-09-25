import { vec2, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;

export class TimerComponent extends Component
{
    initialDelay: number = undefined;
    tickInterval: number = undefined;
    maxTicks: number = undefined;

    // State
    startTime: number = undefined;
    tickCount: number = undefined;

    applyDefaultValues()
    {
        this.initialDelay = 1;
        this.tickInterval = 1;
        this.maxTicks = 1;
        this.startTime = undefined;
        this.tickCount = undefined;
    }
}
ComponentPools["Timer"] = new Pool<TimerComponent>("TimerComponent", g.maxNumEntities, () => new TimerComponent());

//-----------------------------------------------------------------------

export class TimerTickEventComponent extends Component
{
    applyDefaultValues()
    {
    }
}
ComponentPools["TimerTickEvent"] = new Pool<TimerTickEventComponent>("TimerTickEventComponent", g.maxNumEntities, () => new TimerTickEventComponent());

//-----------------------------------------------------------------------

export class SelfRemoverComponent extends Component
{
    applyDefaultValues()
    {
    }
}
ComponentPools["SelfRemover"] = new Pool<SelfRemoverComponent>("SelfRemoverComponent", g.maxNumEntities, () => new SelfRemoverComponent());

//-----------------------------------------------------------------------

export class SpawnerComponent extends Component
{
    entityToSpawnConfigId: string = undefined;
    spawnOffset: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.entityToSpawnConfigId = undefined;
        vec3.set(this.spawnOffset, 0, 0, 0);
    }
}
ComponentPools["Spawner"] = new Pool<SpawnerComponent>("SpawnerComponent", g.maxNumEntities, () => new SpawnerComponent());

//-----------------------------------------------------------------------