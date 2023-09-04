import { mat4, vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { LightComponent } from "../Models/Components";

export default class LightMatrixSyncSystem extends System
{
    private lightTarget: vec3 = vec3.create();

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Light", ["Light"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const lightEntities = this.entityGroups["Light"];

        lightEntities.forEach((entity: Entity) => {
            const lightComponent = ecs.getComponent(entity.id, "Light") as LightComponent;

            let recalculateViewProjMat = false;

            if (!lightComponent.projMatrixSynced)
            {
                mat4.perspective(
                    lightComponent.projMat,
                    lightComponent.falloffEndAngle,
                    1,
                    0.1,
                    lightComponent.maxDist);
                
                recalculateViewProjMat = true;
                lightComponent.projMatrixSynced = true;
            }
            
            if (!lightComponent.viewMatrixSynced)
            {
                vec3.add(this.lightTarget, lightComponent.position, lightComponent.forward);
                mat4.lookAt(
                    lightComponent.viewMat,
                    lightComponent.position,
                    this.lightTarget,
                    lightComponent.up);
                
                recalculateViewProjMat = true;
                lightComponent.viewMatrixSynced = true;
            }

            if (recalculateViewProjMat)
            {
                mat4.multiply(
                    lightComponent.viewProjMat,
                    lightComponent.projMat,
                    lightComponent.viewMat);
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