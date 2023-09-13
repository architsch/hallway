import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { KeyInputComponent } from "../../Input/Models/InputComponents";
import { KinematicsComponent } from "../../Physics/Models/PhysicsComponents";

export default class PlayerControlSystem extends System
{
    controlForce: vec3 = vec3.create();

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Player", ["Player", "Kinematics"]],
            ["KeyInput", ["KeyInput"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const playerEntities = this.queryEntityGroup("Player");
        const keyInputEntities = this.queryEntityGroup("KeyInput");

        let forceX = 0;
        let forceZ = 0;

        keyInputEntities.forEach((entity: Entity) => {
            const keyInputComponent = ecs.getComponent(entity.id, "KeyInput") as KeyInputComponent;
            
            switch (keyInputComponent.key)
            {
                case "ArrowUp": forceZ += 1; break;
                case "ArrowDown": forceZ -= 1; break;
                case "ArrowLeft": forceX += 1; break;
                case "ArrowRight": forceX -= 1; break;
            }
        });

        playerEntities.forEach((entity: Entity) => {
            const kinematics = ecs.getComponent(entity.id, "Kinematics") as KinematicsComponent;
            const forceMag = 20;

            forceX *= forceMag;
            forceZ *= forceMag;
            const mag = Math.sqrt(forceX*forceX + forceZ*forceZ);

            if (mag > 0.001)
            {
                vec3.set(this.controlForce, (forceX / mag) * forceMag, 0, (forceZ / mag) * forceMag);
                vec3.add(kinematics.force, kinematics.force, this.controlForce);
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