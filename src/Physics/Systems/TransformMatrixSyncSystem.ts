import { mat4 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformComponent } from "../Models/Components";

export default class TransformMatrixSyncSystem extends System
{
    private identityMat: mat4;

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Transform", ["Transform"]],
        ];
    }

    start(ecs: ECSManager)
    {
        this.identityMat = mat4.create();
        mat4.identity(this.identityMat);
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
                
                if (entity.parentId < 0)
                    mat4.copy(transformComponent.worldMat, transformComponent.localMat);
                else
                    mat4.multiply(transformComponent.worldMat, this.getParentWorldMat(ecs, entity), transformComponent.localMat);
                
                this.updateChildWorldMats(ecs, entity);

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

    private updateChildWorldMats(ecs: ECSManager, parent: Entity)
    {
        const parentTransformComponent = ecs.getComponent(parent.id, "Transform") as TransformComponent;

        for (const childId of parent.childIds)
        {
            const child = ecs.getEntity(childId);
            const childTransformComponent = ecs.getComponent(childId, "Transform") as TransformComponent;
            mat4.multiply(childTransformComponent.worldMat, parentTransformComponent.worldMat, childTransformComponent.localMat);
            childTransformComponent.meshInstanceSynced = false;
            this.updateChildWorldMats(ecs, child);
        }
    }

    private getParentWorldMat(ecs: ECSManager, entity: Entity): mat4
    {
        if (entity.parentId < 0)
            throw new Error(`Entity ${entity.id} has no parent.`);
        const parentTransformComponent = ecs.getComponent(entity.parentId, "Transform") as TransformComponent;
        return parentTransformComponent.worldMat;
    }
}