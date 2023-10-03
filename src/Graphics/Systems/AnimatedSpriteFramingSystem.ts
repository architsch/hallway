import { vec2 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { AnimatedSpriteComponent, MeshInstanceComponent } from "../Models/GraphicsComponents";

export default class AnimatedSpriteFramingSystem extends System
{
    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["AnimatedSpriteComponent", ["AnimatedSpriteComponent", "MeshInstanceComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const entities = this.queryEntityGroup("AnimatedSpriteComponent");

        entities.forEach((entity: Entity) => {
            const anim = ecs.getComponent(entity.id, "AnimatedSpriteComponent") as AnimatedSpriteComponent;
            const uIndex = Math.floor(t * anim.framesPerSecond) % anim.uvShiftMod[0];
            const vIndex = Math.floor(t * anim.framesPerSecond) % anim.uvShiftMod[1];
            const uShift = anim.uvShiftStart[0] + anim.uvShiftStep[0] * uIndex;
            const vShift = anim.uvShiftStart[1] + anim.uvShiftStep[1] * vIndex;
            if (anim.uvShift[0] != uShift || anim.uvShift[1] != vShift)
            {
                vec2.set(anim.uvShift, uShift, vShift);
                const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstanceComponent") as MeshInstanceComponent;
                meshInstanceComponent.bufferSynced = false;
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