import { mat4, quat, vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { LightComponent } from "../Models/GraphicsComponents";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";

export default class LightMatrixSyncSystem extends System
{
    private lightTarget: vec3 = vec3.create();
    private up: vec3 = vec3.fromValues(0, 1, 0);

    private forwardQuat: quat = quat.create();
    private forward: vec3 = vec3.create();

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["LightComponent", ["LightComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const lightEntities = this.queryEntityGroup("LightComponent");

        lightEntities.forEach((entity: Entity) => {
            const light = ecs.getComponent(entity.id, "LightComponent") as LightComponent;
            const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;

            let recalculateViewProjMat = false;

            if (!light.projMatrixSynced)
            {
                mat4.perspective(
                    light.projMat,
                    light.falloffEndAngle,
                    1,
                    0.1,
                    light.maxDist);
                
                recalculateViewProjMat = true;
                light.projMatrixSynced = true;
            }
            
            if (!light.viewMatrixSynced)
            {
                quat.fromEuler(this.forwardQuat, tr.rotation[0], tr.rotation[1], tr.rotation[2]);
                vec3.set(this.forward, 0, 0, -1);
                vec3.transformQuat(this.forward, this.forward, this.forwardQuat);

                vec3.add(this.lightTarget, tr.position, this.forward);
                mat4.lookAt(
                    light.viewMat,
                    tr.position,
                    this.lightTarget,
                    this.up);
                
                recalculateViewProjMat = true;
                light.viewMatrixSynced = true;
            }

            if (recalculateViewProjMat)
            {
                mat4.multiply(
                    light.viewProjMat,
                    light.projMat,
                    light.viewMat);
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