import { vec2 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { AnimatedSpriteComponent, MeshInstanceComponent } from "../Models/GraphicsComponents";

export default class AnimatedSpriteFramingSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["AnimatedSprite", ["AnimatedSprite", "MeshInstance"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const entities = this.queryEntityGroup("AnimatedSprite");

        entities.forEach((entity: Entity) => {
            const anim = ecs.getComponent(entity.id, "AnimatedSprite") as AnimatedSpriteComponent;
            const uIndex = Math.floor(t * anim.framesPerSecond) % anim.uvShiftMod[0];
            const vIndex = Math.floor(t * anim.framesPerSecond) % anim.uvShiftMod[1];
            const uShift = anim.uvShiftStart[0] + anim.uvShiftStep[0] * uIndex;
            const vShift = anim.uvShiftStart[1] + anim.uvShiftStep[1] * vIndex;
            if (anim.uvShift[0] != uShift || anim.uvShift[1] != vShift)
            {
                vec2.set(anim.uvShift, uShift, vShift);
                const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
                meshInstanceComponent.bufferSynced = false;
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