import { mat4 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformComponent } from "../Models/PhysicsComponents";
import { CameraComponent, LightComponent, MeshInstanceComponent } from "../../Graphics/Models/GraphicsComponents";
import { Component } from "../../ECS/Component";

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
        const transformEntities = this.queryEntityGroup("Transform");

        transformEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;

            if (!tr.matrixSynced)
            {
                mat4.identity(tr.worldMat);
                mat4.translate(tr.worldMat, tr.worldMat, tr.position);
                mat4.rotateX(tr.worldMat, tr.worldMat, tr.rotation[0]);
                mat4.rotateY(tr.worldMat, tr.worldMat, tr.rotation[1]);
                mat4.rotateZ(tr.worldMat, tr.worldMat, tr.rotation[2]);
                mat4.scale(tr.worldMat, tr.worldMat, tr.scale);
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

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }
}