import { vec3 } from "gl-matrix";
import { TransformComponent } from "../../ECS/Components";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";

export default class KinematicsSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["KinematicBody", ["Transform"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const kinematicBodyEntities = this.entityGroups["KinematicBody"];

        kinematicBodyEntities.forEach((entity: Entity) => {
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            
            if (entity.id % 2 == 1)
            {
                vec3.set(transformComponent.position,
                    3 * Math.cos(entity.id * 0.25*Math.PI + 0.2*t),
                    3 * Math.sin(entity.id * 0.25*Math.PI + 0.2*t),
                    0);
                
                transformComponent.matrixSynced = false;
            }
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
        const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            
        if (entity.id % 2 == 0)
        {
            vec3.set(transformComponent.position,
                3 * Math.cos(entity.id * 0.25*Math.PI),
                3 * Math.sin(entity.id * 0.25*Math.PI),
                2);
            
            transformComponent.matrixSynced = false;
        }
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}