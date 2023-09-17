import { vec2, vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { LevelMemberComponent, LevelPortalComponent } from "../Models/GameComponents";
import { SpriteComponent } from "../../Graphics/Models/GraphicsComponents";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import Random from "../../Util/Math/Random";

const g = globalPropertiesConfig;
const deg2rad = Math.PI / 180;
const s = 0.0625;

export default class LevelFactory
{
    static addWorldChunk(ecs: ECSManager, levelIndex: number, chunkIndex: number)
    {
        const carryoverPending = (chunkIndex == g.numWorldChunks-1);
        const chunkZ1 = g.worldChunkSize[2] * chunkIndex;
        const chunkZ2 = g.worldChunkSize[2] * (chunkIndex+1);
        const chunkZCenter = 0.5 * (chunkZ1 + chunkZ2);
        
        // Floor
        this.addSpriteEntity(ecs, "floor", 0, 0, chunkZCenter, -90 * deg2rad, 0, 0, 1, 1, 1, this.getFloorSpriteDims(levelIndex), levelIndex, carryoverPending);
        // Ceiling
        this.addSpriteEntity(ecs, "floor", 0, g.worldChunkSize[1], chunkZCenter, +90 * deg2rad, 0, 0, 1, 1, 1, this.getCeilingSpriteDims(levelIndex), levelIndex, carryoverPending);
        // Left Wall
        this.addSpriteEntity(ecs, "wall", -0.5*g.worldChunkSize[0], 0.5*g.worldChunkSize[1], chunkZCenter, 0, 90 * deg2rad, 0, 1, 1, 1, this.getWallSpriteDims(levelIndex), levelIndex, carryoverPending);
        // Right Wall
        this.addSpriteEntity(ecs, "wall", 0.5*g.worldChunkSize[0], 0.5*g.worldChunkSize[1], chunkZCenter, 0, -90 * deg2rad, 0, 1, 1, 1, this.getWallSpriteDims(levelIndex), levelIndex, carryoverPending);

        // Actors
        for (let i = 1; i < 4; ++i)
        {
            const x = Random.randomBetween(g.worldBoundMin[0] + 1.5, g.worldBoundMax[0] - 1.5);
            const y = g.worldBoundMin[1] + 5;
            const z = Random.randomBetween(chunkZ1 + 3, chunkZ2 - 3);
            this.addSpriteEntity(ecs, "actor", x, y, z, 180 * deg2rad, 180 * deg2rad, 0, 2, 2, 2, [[2, 2], [0, 6]], levelIndex, carryoverPending);
        }

        // Level Portal
        if (chunkIndex == g.numWorldChunks-1)
        {
            const entity = this.addSpriteEntity(ecs, "levelPortal",
                0.5 * (g.worldBoundMin[0] + g.worldBoundMax[0]), g.worldBoundMin[1] + 1, chunkZ2 - 0.5,
                180 * deg2rad, 180 * deg2rad, 0, 1, 1, 1,
                [[1, 1], [0, 0]], levelIndex, false);
            
            const levelPortal = ecs.getComponent(entity.id, "LevelPortal") as LevelPortalComponent;
            levelPortal.newLevelIndex = levelIndex + 1;
        }
    }

    static addSpriteEntity(ecs: ECSManager, entityConfigId: string,
        x: number, y: number, z: number,
        xr: number, yr: number, zr: number,
        xs: number, ys: number, zs: number,
        spriteDims: [[number, number], [number, number]],
        levelIndex: number, carryoverPending: boolean): Entity
    {
        const entity = ecs.addEntity(entityConfigId);
        this.setEntityTransformParams(ecs, entity, x, y, z, xr, yr, zr, xs, ys, zs);
        this.setEntitySpriteParams(ecs, entity, spriteDims[0][0]*s, spriteDims[0][1]*s, spriteDims[1][0]*s, spriteDims[1][1]*s);
        if (levelIndex >= 0)
        {
            const levelMember = ecs.addComponent(entity.id, "LevelMember") as LevelMemberComponent;
            levelMember.levelIndex = levelIndex;
            levelMember.carryoverPending = carryoverPending;
        }
        return entity;
    }

    private static setEntityTransformParams(ecs: ECSManager, entity: Entity,
        x: number, y: number, z: number,
        xr: number, yr: number, zr: number,
        xs: number, ys: number, zs: number)
    {
        const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
        vec3.set(transformComponent.position, x, y, z);
        vec3.set(transformComponent.rotation, xr, yr, zr);
        vec3.set(transformComponent.scale, xs, ys, zs);
    }

    private static setEntitySpriteParams(ecs: ECSManager, entity: Entity,
        uScale: number, vScale: number,
        uShift: number, vShift: number)
    {
        const spriteComponent = ecs.getComponent(entity.id, "Sprite") as SpriteComponent;
        vec2.set(spriteComponent.uvScale, uScale, vScale);
        vec2.set(spriteComponent.uvShift, uShift, vShift);
    }

    private static getFloorSpriteDims(levelIndex: number): [[number, number], [number, number]]
    {
        return [[1, 1], [14, 8]];
    }
    private static getWallSpriteDims(levelIndex: number): [[number, number], [number, number]]
    {
        return [[1, 1], [13, 8]];
    }
    private static getCeilingSpriteDims(levelIndex: number): [[number, number], [number, number]]
    {
        return [[1, 1], [11, 8]];
    }
}