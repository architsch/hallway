import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { Component } from "../../ECS/Component";
import { TimerComponent } from "../Models/DynamicComponents";

export default class TimerSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Timer", ["Timer"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const timerEntities = this.queryEntityGroup("Timer");

        timerEntities.forEach((entity: Entity) => {
            const timer = ecs.getComponent(entity.id, "Timer") as TimerComponent;
            if (timer.startTime == undefined) // Hasn't been started yet
            {
                timer.startTime = t;
                timer.tickCount = 0;
            }
            else
            {
                if (timer.tickCount == 0) // Hasn't been ticked yet
                {
                    if (t > timer.startTime + timer.initialDelay)
                        this.tick(ecs, entity, timer, t);
                }
                else // Has been ticked before
                {
                    if (t > timer.startTime + timer.tickInterval && (timer.maxTicks < 0 || timer.tickCount < timer.maxTicks))
                        this.tick(ecs, entity, timer, t);
                }
            }
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }

    private tick(ecs: ECSManager, entity: Entity, timer: TimerComponent, t: number)
    {
        timer.startTime = t;
        timer.tickCount++;
        timer.onTick(ecs, entity, timer.tickCount);
    }
}