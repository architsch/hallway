import { mat4 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformComponent } from "../Models/PhysicsComponents";
import { CameraComponent, MeshInstanceComponent } from "../../Graphics/Models/GraphicsComponents";

export default class TransformMatrixSyncSystem extends System
{
    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["TransformComponent", ["TransformComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const transformEntities = this.queryEntityGroup("TransformComponent");

        transformEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;

            if (!tr.matrixSynced)
            {
                mat4.identity(tr.worldMat);
                mat4.translate(tr.worldMat, tr.worldMat, tr.position);
                mat4.rotateX(tr.worldMat, tr.worldMat, tr.rotation[0]);
                mat4.rotateY(tr.worldMat, tr.worldMat, tr.rotation[1]);
                mat4.rotateZ(tr.worldMat, tr.worldMat, tr.rotation[2]);
                mat4.scale(tr.worldMat, tr.worldMat, tr.scale);
                tr.matrixSynced = true;

                if (ecs.hasComponent(entity.id, "MeshInstanceComponent"))
                {
                    const meshInstance = ecs.getComponent(entity.id, "MeshInstanceComponent") as MeshInstanceComponent;
                    meshInstance.bufferSynced = false;
                }
                if (ecs.hasComponent(entity.id, "CameraComponent"))
                {
                    const cam = ecs.getComponent(entity.id, "CameraComponent") as CameraComponent;
                    cam.viewMatrixSynced = false;
                }
            }
        });
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}