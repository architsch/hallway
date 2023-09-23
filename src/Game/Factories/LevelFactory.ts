import { vec2, vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { LevelMemberComponent, LevelPortalComponent } from "../Models/LevelComponents";
import { SpriteComponent } from "../../Graphics/Models/GraphicsComponents";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import Random from "../../Util/Math/Random";

const g = globalPropertiesConfig;
const s = g.spriteAtlasGridCellSize;
const deg2rad = Math.PI / 180;

export default class LevelFactory
{
    static addWorldChunk(ecs: ECSManager, levelIndex: number, chunkIndex: number)
    {
        const carryoverPending = (chunkIndex == g.numWorldChunks-1);
        const chunkZ1 = g.worldChunkSize[2] * chunkIndex;
        const chunkZ2 = g.worldChunkSize[2] * (chunkIndex+1);
        const chunkZCenter = 0.5 * (chunkZ1 + chunkZ2);
        
        // Floor
        let entity = this.addSpriteEntity(ecs, "floor", 0, 0, chunkZCenter, levelIndex, carryoverPending,);
        this.setFloorSpriteDims(ecs, entity, levelIndex);
        this.setRotation(ecs, entity, -90 * deg2rad, 0, 0);

        // Ceiling
        entity = this.addSpriteEntity(ecs, "floor", 0, g.worldChunkSize[1], chunkZCenter, levelIndex, carryoverPending);
        this.setCeilingSpriteDims(ecs, entity, levelIndex);
        this.setRotation(ecs, entity, +90 * deg2rad, 0, 0);
        
        // Left Wall
        entity = this.addSpriteEntity(ecs, "wall", -0.5*g.worldChunkSize[0], 0.5*g.worldChunkSize[1], chunkZCenter, levelIndex, carryoverPending);
        this.setWallSpriteDims(ecs, entity, levelIndex);
        this.setRotation(ecs, entity, 0, 90 * deg2rad, 0);
        
        // Right Wall
        entity = this.addSpriteEntity(ecs, "wall", 0.5*g.worldChunkSize[0], 0.5*g.worldChunkSize[1], chunkZCenter, levelIndex, carryoverPending);
        this.setWallSpriteDims(ecs, entity, levelIndex);
        this.setRotation(ecs, entity, 0, -90 * deg2rad, 0);

        for (let i = 1; i <= 3; ++i)
        {
            const x = Random.randomBetween(g.worldBoundMin[0] + 1.5, g.worldBoundMax[0] - 1.5);
            const y = g.worldBoundMin[1] + 5;
            const z = Random.randomBetween(chunkZ1 + 3, chunkZ2 - 3);
            this.addSpriteEntity(ecs, "actor", x, y, z, levelIndex, carryoverPending);
        }
        for (let i = 1; i <= 1; ++i)
        {
            const x = Random.randomBetween(g.worldBoundMin[0] + 1.5, g.worldBoundMax[0] - 1.5);
            const y = g.worldBoundMin[1] + 1.25;
            const z = Random.randomBetween(chunkZ1 + 3, chunkZ2 - 3);
            this.addSpriteEntity(ecs, "shooter", x, y, z, levelIndex, carryoverPending);
        }
        for (let i = 1; i <= 3; ++i)
        {
            const x = Random.randomBetween(g.worldBoundMin[0] + 1.5, g.worldBoundMax[0] - 1.5);
            const y = g.worldBoundMin[1] + 0.5*g.worldChunkSize[1];
            const z = Random.randomBetween(chunkZ1 + 3, chunkZ2 - 3);
            this.addSpriteEntity(ecs, "column", x, y, z, levelIndex, carryoverPending);
        }
        for (let i = 1; i <= 3; ++i)
        {
            const x = Random.randomBetween(g.worldBoundMin[0] + 1.5, g.worldBoundMax[0] - 1.5);
            const y = g.worldBoundMin[1] + 0.5;
            const z = Random.randomBetween(chunkZ1 + 3, chunkZ2 - 3);
            this.addSpriteEntity(ecs, "cube", x, y, z, levelIndex, carryoverPending);
        }

        // Level Portal
        if (chunkIndex == g.numWorldChunks-1)
        {
            const entity = this.addSpriteEntity(ecs, "levelPortal",
                0.5 * (g.worldBoundMin[0] + g.worldBoundMax[0]), g.worldBoundMin[1] + 1, chunkZ2 - 0.5,
                levelIndex, false);
            const levelPortal = ecs.getComponent(entity.id, "LevelPortal") as LevelPortalComponent;
            levelPortal.newLevelIndex = levelIndex + 1;
        }
    }

    static addSpriteEntity(ecs: ECSManager, entityConfigId: string,
        x: number, y: number, z: number,
        levelIndex: number, carryoverPending: boolean): Entity
    {
        const entity = ecs.addEntity(entityConfigId);
        const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
        vec3.set(transformComponent.position, x, y, z);

        if (levelIndex >= 0)
        {
            const levelMember = ecs.addComponent(entity.id, "LevelMember") as LevelMemberComponent;
            levelMember.levelIndex = levelIndex;
            levelMember.carryoverPending = carryoverPending;
        }
        return entity;
    }

    private static setRotation(ecs: ECSManager, entity: Entity, xr: number, yr: number, zr: number)
    {
        const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
        vec3.set(tr.rotation, xr, yr, zr);
    }

    private static setFloorSpriteDims(ecs: ECSManager, entity: Entity, levelIndex: number)
    {
        const sprite = ecs.getComponent(entity.id, "Sprite") as SpriteComponent;
        vec2.set(sprite.uvShift, 14*s, 8*s);
    }
    private static setWallSpriteDims(ecs: ECSManager, entity: Entity, levelIndex: number)
    {
        const sprite = ecs.getComponent(entity.id, "Sprite") as SpriteComponent;
        vec2.set(sprite.uvShift, 13*s, 8*s);
    }
    private static setCeilingSpriteDims(ecs: ECSManager, entity: Entity, levelIndex: number)
    {
        const sprite = ecs.getComponent(entity.id, "Sprite") as SpriteComponent;
        vec2.set(sprite.uvShift, 11*s, 8*s);
    }
}