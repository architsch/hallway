import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformChildComponent, TransformComponent } from "../Models/PhysicsComponents";
import { Component } from "../../ECS/Component";

export default class TransformChildSyncSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["TransformChild", ["TransformChild", "Transform"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const entities = this.queryEntityGroup("TransformChild");

        entities.forEach((entity: Entity) => {
            const child = ecs.getComponent(entity.id, "TransformChild") as TransformChildComponent;

            if (child.parentEntityId >= 0) // I have a parent (-1 means there is no parent)
            {
                const parent = ecs.getEntity(child.parentEntityId);
                if (parent.alive && parent.birthCount == child.parentEntityBirthCount)
                {
                    const childTr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
                    const parentTr = ecs.getComponent(parent.id, "Transform") as TransformComponent;
                    vec3.copy(childTr.position, parentTr.position);
                    vec3.copy(childTr.rotation, parentTr.rotation);
                    vec3.copy(childTr.scale, parentTr.scale);
                }
                else // Parent has been remove, so let's remove myself as well because I depend on it.
                {
                    ecs.removeEntity(child.id);
                }
            }
            else
                throw new Error(`No valid parent ID found in TransformChildComponent (parentEntityId = ${child.parentEntityId})`);
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }
}