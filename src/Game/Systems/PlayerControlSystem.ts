import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { KeyInputComponent } from "../../Input/Models/InputComponents";
import { KinematicsComponent, TransformChildComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { Component } from "../../ECS/Component";

export default class PlayerControlSystem extends System
{
    controlForce: vec3 = vec3.create();

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Player", ["Player"]],
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

        let player: Entity;
        let playerKinematics: KinematicsComponent;
        let playerTr: TransformComponent;

        playerEntities.forEach((entity: Entity) => {
            if (player == undefined)
            {
                playerKinematics = ecs.getComponent(entity.id, "Kinematics") as KinematicsComponent;
                playerTr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
                player = entity;
            }
            else
                throw new Error("Multiple players detected.");
        });

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
                case " ":
                    const entity = ecs.addEntity("playerWind");
                    const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
                    vec3.copy(tr.position, playerTr.position);
                    const child = ecs.getComponent(entity.id, "TransformChild") as TransformChildComponent;
                    child.parentEntityId = player.id;
                    child.parentEntityBirthCount = player.birthCount;
                    break;
            }
        });

        const forceMag = 20;

        forceX *= forceMag;
        forceZ *= forceMag;
        const mag = Math.sqrt(forceX*forceX + forceZ*forceZ);

        if (mag > 0.001)
        {
            vec3.set(this.controlForce, (forceX / mag) * forceMag, 0, (forceZ / mag) * forceMag);
            vec3.add(playerKinematics.pendingForce, playerKinematics.pendingForce, this.controlForce);
        }
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }
}