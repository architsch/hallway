import { mat4, quat, vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CameraComponent } from "../Models/GraphicsComponents";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { Component } from "../../ECS/Component";

export default class CameraMatrixSyncSystem extends System
{
    private cameraTarget: vec3 = vec3.create();
    private up: vec3 = vec3.fromValues(0, 1, 0);

    private forwardQuat: quat = quat.create();
    private forward: vec3 = vec3.create();

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Camera", ["Camera", "Transform"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const cameraEntities = this.queryEntityGroup("Camera");

        cameraEntities.forEach((entity: Entity) => {
            const cam = ecs.getComponent(entity.id, "Camera") as CameraComponent;
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;

            let recalculateViewProjMat = false;

            if (!cam.projMatrixSynced)
            {
                mat4.perspective(
                    cam.projMat,
                    cam.fovy,
                    cam.aspectRatio,
                    cam.near,
                    cam.far);
                
                recalculateViewProjMat = true;
                cam.projMatrixSynced = true;
            }
            
            if (!cam.viewMatrixSynced)
            {
                quat.fromEuler(this.forwardQuat, tr.rotation[0], tr.rotation[1], tr.rotation[2]);
                vec3.set(this.forward, 0, 0, -1);
                vec3.transformQuat(this.forward, this.forward, this.forwardQuat);

                vec3.add(this.cameraTarget, tr.position, this.forward);
                mat4.lookAt(
                    cam.viewMat,
                    tr.position,
                    this.cameraTarget,
                    this.up);
                
                recalculateViewProjMat = true;
                cam.viewMatrixSynced = true;
            }

            if (recalculateViewProjMat)
            {
                mat4.multiply(
                    cam.viewProjMat,
                    cam.projMat,
                    cam.viewMat);
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