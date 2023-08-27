import { mat4 } from "gl-matrix";
import { TransformComponent } from "../../ECS/Components";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";

export default class TransformMatrixSyncSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Transform", ["Transform"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const transformEntities = this.entityGroups["Transform"];

        transformEntities.forEach((entity: Entity) => {
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;

            if (!transformComponent.matrixSynced)
            {
                mat4.identity(transformComponent.localMat);
                mat4.translate(transformComponent.localMat, transformComponent.localMat, transformComponent.position);
                mat4.rotateX(transformComponent.localMat, transformComponent.localMat, transformComponent.rotation[0]);
                mat4.rotateY(transformComponent.localMat, transformComponent.localMat, transformComponent.rotation[1]);
                mat4.rotateZ(transformComponent.localMat, transformComponent.localMat, transformComponent.rotation[2]);
                mat4.scale(transformComponent.localMat, transformComponent.localMat, transformComponent.scale);
                
                // TODO: Change the line below to recursive parent-child naviation & cascade localMat multiplication to derive worldMat.
                // (Once we introduce a hierarchical structure to the world of Transforms).
                mat4.copy(transformComponent.worldMat, transformComponent.localMat);

                transformComponent.matrixSynced = true;
                transformComponent.meshInstanceSynced = false;
            }
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}