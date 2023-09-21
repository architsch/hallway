import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { Component } from "../../ECS/Component";
import { DelayedSelfRemoverComponent } from "../Models/DynamicComponents";

export default class DelayedSelfRemoverSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["DelayedSelfRemover", ["DelayedSelfRemover"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const entities = this.queryEntityGroup("DelayedSelfRemover");

        entities.forEach((entity: Entity) => {
            const component = ecs.getComponent(entity.id, "DelayedSelfRemover") as DelayedSelfRemoverComponent;
            if (component.startTime == undefined)
            {
                component.startTime = t;
            }
            else
            {
                if (t > component.startTime + component.delayDuration)
                {
                    ecs.removeEntity(entity.id);
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
}