import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { RigidbodyComponent, TransformComponent } from "../Models/PhysicsComponents";

export default class KinematicsSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Rigidbody", ["Transform", "Rigidbody"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const rigidbodyEntities = this.entityGroups["Rigidbody"];

        rigidbodyEntities.forEach((entity: Entity) => {
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const rigidbodyComponent = ecs.getComponent(entity.id, "Rigidbody") as RigidbodyComponent;
            
            vec3.set(transformComponent.position,
                3 * Math.cos(entity.id * 0.25*Math.PI + 0.2*t),
                3 * Math.sin(entity.id * 0.25*Math.PI + 0.2*t),
                0);
            vec3.set(transformComponent.rotation,
                3 * Math.cos(entity.id * 0.1*Math.PI + 0.09*t),
                3 * Math.sin(entity.id * 0.15*Math.PI + 0.12*t),
                3 * Math.sin(entity.id * 0.2*Math.PI + 0.15*t));
            
            transformComponent.matrixSynced = false;
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}