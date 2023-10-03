import { mat4, vec3 } from "gl-matrix";
import { ComponentTypeBitMasks } from "../../ECS/Component";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CameraComponent, LightComponent } from "../Models/GraphicsComponents";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";

export default class UniformSystem extends System
{
    private static singletonGraphicsComponentEntityIds: {[componentType: string]: number} = {};
    private static fallbackMat4 = mat4.create();
    private static fallbackVec3 = vec3.create();

    static cameraViewProjMat(ecs: ECSManager): mat4
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["CameraComponent"];
        const obj = ecs.getComponent(entityId, "CameraComponent");
        if (obj != undefined)
            return (obj as CameraComponent).viewProjMat;
        else
        {
            console.warn("'cameraViewProjMat' uniform not prepared yet.");
            return UniformSystem.fallbackMat4;
        }
    }
    static cameraPosition(ecs: ECSManager): vec3
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["CameraComponent"];
        const obj = ecs.getComponent(entityId, "CameraComponent");
        if (obj != undefined)
            return (ecs.getComponent(entityId, "TransformComponent") as TransformComponent).position;
        else
        {
            console.warn("'cameraPosition' uniform not prepared yet.");
            return UniformSystem.fallbackVec3;
        }
    }
    static ambLightColor(ecs: ECSManager): vec3
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["LightComponent"];
        const obj = ecs.getComponent(entityId, "LightComponent");
        if (obj != undefined)
            return (obj as LightComponent).ambLightColor;
        else
        {
            console.warn("'ambLightColor' uniform not prepared yet.");
            return UniformSystem.fallbackVec3;
        }
    }
    static ambLightIntensity(ecs: ECSManager): number
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["LightComponent"];
        const obj = ecs.getComponent(entityId, "LightComponent");
        if (obj != undefined)
            return (obj as LightComponent).ambLightIntensity;
        else
        {
            console.warn("'ambLightIntensity' uniform not prepared yet.");
            return 0;
        }
    }
    static spotLightPosition(ecs: ECSManager): vec3
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["LightComponent"];
        const obj = ecs.getComponent(entityId, "LightComponent");
        if (obj != undefined)
            return (ecs.getComponent(entityId, "TransformComponent") as TransformComponent).position;
        else
        {
            console.warn("'spotLightPosition' uniform not prepared yet.");
            return UniformSystem.fallbackVec3;
        }
    }
    static spotLightColor(ecs: ECSManager): vec3
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["LightComponent"];
        const obj = ecs.getComponent(entityId, "LightComponent");
        if (obj != undefined)
            return (obj as LightComponent).spotLightColor;
        else
        {
            console.warn("'spotLightColor' uniform not prepared yet.");
            return UniformSystem.fallbackVec3;
        }
    }
    static spotLightIntensity(ecs: ECSManager): number
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["LightComponent"];
        const obj = ecs.getComponent(entityId, "LightComponent");
        if (obj != undefined)
            return (obj as LightComponent).spotLightIntensity;
        else
        {
            console.warn("'spotLightIntensity' uniform not prepared yet.");
            return 0;
        }
    }
    static spotLightViewProjMat(ecs: ECSManager): mat4
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["LightComponent"];
        const obj = ecs.getComponent(entityId, "LightComponent");
        if (obj != undefined)
            return (obj as LightComponent).viewProjMat;
        else
        {
            console.warn("'spotLightViewProjMat' uniform not prepared yet.");
            return UniformSystem.fallbackMat4;
        }
    }

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CameraComponent", ["CameraComponent"]],
            ["LightComponent", ["LightComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
        const kvps = this.getCriteria();

        for (const [groupId, requiredComponentTypes] of kvps)
        {
            for (const componentType of requiredComponentTypes)
            {
                if (entity.componentBitMask.hasAllComponentsInMask(ComponentTypeBitMasks[componentType]))
                {
                    const entityId = UniformSystem.singletonGraphicsComponentEntityIds[componentType];
                    if (entityId == undefined)
                    {
                        UniformSystem.singletonGraphicsComponentEntityIds[componentType] = entity.id;
                        console.log(`Singleton graphics component registered :: ${componentType}`);
                    }
                    else if (entityId != entity.id)
                    {
                        throw new Error(`Duplicate singleton graphics components found (componentType: ${componentType}, entityId1: ${entity.id}, entityId2: ${entityId})`);
                    }
                }
            }
        }
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}