import { mat4, vec3 } from "gl-matrix";
import { ComponentTypeBitMasks } from "../../ECS/Component";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CameraComponent } from "../Models/GraphicsComponents";
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
    static cameraPos(ecs: ECSManager): vec3
    {
        const entityId = UniformSystem.singletonGraphicsComponentEntityIds["CameraComponent"];
        const obj = ecs.getComponent(entityId, "CameraComponent");
        if (obj != undefined)
            return (ecs.getComponent(entityId, "TransformComponent") as TransformComponent).position;
        else
        {
            console.warn("'cameraPos' uniform not prepared yet.");
            return UniformSystem.fallbackVec3;
        }
    }

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CameraComponent", ["CameraComponent"]],
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
                    if (entityId != entity.id)
                    {
                        UniformSystem.singletonGraphicsComponentEntityIds[componentType] = entity.id;
                        console.log(`Singleton graphics component registered :: ${componentType}`);
                    }
                }
            }
        }
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}