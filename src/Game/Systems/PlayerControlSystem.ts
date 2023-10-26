import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { KeyInputComponent } from "../../Input/Models/InputComponents";
import { KinematicsComponent, TransformChildComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";

export default class PlayerControlSystem extends System
{
    controlForce: vec3 = vec3.create();

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["PlayerComponent", ["PlayerComponent"]],
            ["KeyInputComponent", ["KeyInputComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const playerEntities = this.queryEntityGroup("PlayerComponent");
        const keyInputEntities = this.queryEntityGroup("KeyInputComponent");

        let player: Entity = undefined;
        let playerKinematics: KinematicsComponent;
        let playerTr: TransformComponent;

        playerEntities.forEach((entity: Entity) => {
            if (player == undefined)
            {
                playerKinematics = ecs.getComponent(entity.id, "KinematicsComponent") as KinematicsComponent;
                playerTr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
                player = entity;
            }
            else
                throw new Error("Multiple players detected.");
        });

        if (player != undefined)
        {
            let forceX = 0;
            let forceZ = 0;

            keyInputEntities.forEach((entity: Entity) => {
                const keyInputComponent = ecs.getComponent(entity.id, "KeyInputComponent") as KeyInputComponent;
                
                switch (keyInputComponent.key)
                {
                    case "ArrowUp": forceZ += 1; break;
                    case "ArrowDown": forceZ -= 1; break;
                    case "ArrowLeft": forceX += 1; break;
                    case "ArrowRight": forceX -= 1; break;
                    default: break;
                }
            });

            const forceMag = 15;

            forceX *= forceMag;
            forceZ *= forceMag;
            const mag = Math.sqrt(forceX*forceX + forceZ*forceZ);

            if (mag > 0.001)
            {
                vec3.set(this.controlForce, (forceX / mag) * forceMag, 0, (forceZ / mag) * forceMag);
                vec3.add(playerKinematics.pendingForce, playerKinematics.pendingForce, this.controlForce);
            }
        }
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}