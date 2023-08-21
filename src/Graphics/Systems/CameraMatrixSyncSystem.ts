import { mat4 } from "gl-matrix";
import { CameraComponent } from "../../ECS/Components";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";

export default class CameraMatrixSyncSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Camera", ["Camera"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const cameraEntities = this.entityGroups["Camera"];

        cameraEntities.forEach((entity: Entity) => {
            const cameraComponent = ecs.getComponent(entity.id, "Camera") as CameraComponent;

            let recalculateViewProjMat = false;

            if (!cameraComponent.projMatrixSynced)
            {
                mat4.perspective(
                    cameraComponent.projMat,
                    cameraComponent.fovy,
                    cameraComponent.aspectRatio,
                    cameraComponent.near,
                    cameraComponent.far);
                
                recalculateViewProjMat = true;
                cameraComponent.projMatrixSynced = true;
            }
            
            if (!cameraComponent.viewMatrixSynced)
            {
                mat4.lookAt(
                    cameraComponent.viewMat,
                    cameraComponent.position,
                    cameraComponent.target,
                    cameraComponent.up);
                
                recalculateViewProjMat = true;
                cameraComponent.viewMatrixSynced = true;
            }

            if (recalculateViewProjMat)
            {
                mat4.multiply(
                    cameraComponent.viewProjMat,
                    cameraComponent.projMat,
                    cameraComponent.viewMat);
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