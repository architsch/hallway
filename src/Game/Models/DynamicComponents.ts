import { vec2, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";

const g = globalPropertiesConfig;

export class TimerComponent extends Component
{
    initialDelay: number = undefined;
    tickInterval: number = undefined;
    maxTicks: number = undefined;
    onTick: (ecs: ECSManager, entity: Entity, tickCount: number) => void = undefined;

    // State
    startTime: number = undefined;
    tickCount: number = undefined;

    applyDefaultValues()
    {
        this.initialDelay = 1;
        this.tickInterval = 1;
        this.maxTicks = 1;
        this.onTick = undefined;
        this.startTime = undefined;
        this.tickCount = undefined;
    }
}
ComponentPools["Timer"] = new Pool<TimerComponent>("TimerComponent", g.maxNumEntities, () => new TimerComponent());

//-----------------------------------------------------------------------