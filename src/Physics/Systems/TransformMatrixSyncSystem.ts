import { mat4 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformComponent } from "../Models/PhysicsComponents";
import { CameraComponent, LightComponent, MeshInstanceComponent } from "../../Graphics/Models/GraphicsComponents";

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
        const transformEntities = this.queryEntityGroup("Transform");

        transformEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;

            if (!tr.matrixSynced)
            {
                mat4.identity(tr.localMat);
                mat4.translate(tr.localMat, tr.localMat, tr.position);
                mat4.rotateX(tr.localMat, tr.localMat, tr.rotation[0]);
                mat4.rotateY(tr.localMat, tr.localMat, tr.rotation[1]);
                mat4.rotateZ(tr.localMat, tr.localMat, tr.rotation[2]);
                mat4.scale(tr.localMat, tr.localMat, tr.scale);
                
                if (entity.parentId < 0)
                    mat4.copy(tr.worldMat, tr.localMat);
                else
                    mat4.multiply(tr.worldMat, this.getParentWorldMat(ecs, entity), tr.localMat);
                
                this.updateChildWorldMats(ecs, entity);

                tr.matrixSynced = true;

                if (ecs.hasComponent(entity.id, "MeshInstance"))
                {
                    const meshInstance = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
                    meshInstance.bufferSynced = false;
                }
                if (ecs.hasComponent(entity.id, "Camera"))
                {
                    const cam = ecs.getComponent(entity.id, "Camera") as CameraComponent;
                    cam.viewMatrixSynced = false;
                }
                if (ecs.hasComponent(entity.id, "Light"))
                {
                    const light = ecs.getComponent(entity.id, "Light") as LightComponent;
                    light.viewMatrixSynced = false;
                }
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
            if (ecs.hasComponent(childId, "MeshInstance"))
            {
                const childMeshInstanceComponent = ecs.getComponent(childId, "MeshInstance") as MeshInstanceComponent;
                childMeshInstanceComponent.bufferSynced = false;
            }
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