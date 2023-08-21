import { vec3 } from "gl-matrix";
import { CameraComponent, KeyInputComponent } from "../../ECS/Components";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";

export default class CameraControlSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Camera", ["Camera"]],
            ["KeyInput", ["KeyInput"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const cameraEntities = this.entityGroups["Camera"];
        const keyInputEntities = this.entityGroups["KeyInput"];

        let forceX = 0;
        let forceZ = 0;

        keyInputEntities.forEach((entity: Entity) => {
            const keyInputComponent = ecs.getComponent(entity.id, "KeyInput") as KeyInputComponent;
            
            switch (keyInputComponent.key)
            {
                case "UpArrow": forceZ -= 1; break;
                case "DownArrow": forceZ += 1; break;
                case "LeftArrow": forceX -= 1; break;
                case "RightArrow": forceX += 1; break;
            }
        });

        cameraEntities.forEach((entity: Entity) => {
            const cameraComponent = ecs.getComponent(entity.id, "Camera") as CameraComponent;

            const cameraSpeed = 2;
            const p = cameraComponent.position;
            vec3.set(cameraComponent.position, p[0] + forceX*cameraSpeed, p[1], p[2] + forceZ*cameraSpeed);

            cameraComponent.viewMatrixSynced = false;
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}