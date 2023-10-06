import { vec2, vec3 } from "gl-matrix";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import ECSManager from "../../ECS/ECSManager";
import Random from "../../Util/Math/Random";
import { LevelPortalComponent } from "../Models/LevelComponents";
import Entity from "../../ECS/Entity";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { SpriteComponent } from "../../Graphics/Models/GraphicsComponents";

const g = globalPropertiesConfig;
const s = g.spriteAtlasGridCellSize;
const deg2rad = Math.PI / 180;

const x1 = g.worldBoundMin[0] + 0.5;
const x2 = g.worldBoundMax[0] - 0.5;
const y1 = g.worldBoundMin[1] + 0.5;
const y2 = g.worldBoundMax[1] - 0.5;
let z1 = g.worldBoundMin[2];
const z2 = g.worldBoundMax[2];

export default class LevelFactory
{
    static populate(ecs: ECSManager, levelIndex: number, levelEntranceZ: number)
    {
        z1 = levelEntranceZ;
        const zCenter = 0.5 * (g.worldBoundMin[2] + g.worldBoundMax[2]);
        
        // Floor
        let entity = LevelFactory.addSpriteEntity(ecs, "floor", 0, 0, zCenter);
        LevelFactory.setFloorSpriteDims(ecs, entity, levelIndex);
        LevelFactory.setRotation(ecs, entity, -90 * deg2rad, 0, 0);

        // Ceiling
        entity = LevelFactory.addSpriteEntity(ecs, "floor", 0, g.worldBoundSize[1], zCenter);
        LevelFactory.setCeilingSpriteDims(ecs, entity, levelIndex);
        LevelFactory.setRotation(ecs, entity, +90 * deg2rad, 0, 0);
        
        // Left Wall
        entity = LevelFactory.addSpriteEntity(ecs, "wall", -0.5*g.worldBoundSize[0], 0.5*g.worldBoundSize[1], zCenter);
        LevelFactory.setWallSpriteDims(ecs, entity, levelIndex);
        LevelFactory.setRotation(ecs, entity, 0, 90 * deg2rad, 0);
        
        // Right Wall
        entity = LevelFactory.addSpriteEntity(ecs, "wall", 0.5*g.worldBoundSize[0], 0.5*g.worldBoundSize[1], zCenter);
        LevelFactory.setWallSpriteDims(ecs, entity, levelIndex);
        LevelFactory.setRotation(ecs, entity, 0, -90 * deg2rad, 0);

        // Entrance
        LevelFactory.addBarricadeLine(ecs, z1, levelIndex, [LevelFactory.addColumn], [1], LevelFactory.addNone, Math.floor(0.5 * (x1+x2)));

        const blockSize = 11;
        for (let z = z1; z + blockSize <= z2; z += blockSize)
        {
            const zPivot = Random.randomIntBetween(z + 0.3*blockSize, z + 0.7*blockSize);
            LevelFactory.addBarricadeLine(ecs, zPivot, levelIndex, [LevelFactory.addColumn, LevelFactory.addCube, LevelFactory.addNone], [5, 3, 1], LevelFactory.addNone);
        }

        // Exit
        LevelFactory.addBarricadeLine(ecs, z2, levelIndex, [LevelFactory.addColumn], [1], LevelFactory.addLevelDoor, Math.floor(0.5 * (x1+x2)));
    }

    static addBarricadeLine(ecs: ECSManager, z: number, levelIndex: number,
        randomPlacementActions: Array<(ecs: ECSManager, x: number, z: number, levelIndex: number) => void>,
        randomPlacementChanceWeights: Array<number>,
        mainPassagePlacementAction: (ecs: ECSManager, x: number, z: number, levelIndex: number) => void,
        mainPassageIndex: number = -1)
    {
        if (mainPassageIndex < 0)
            mainPassageIndex = Random.randomIntBetween(x1, x2);
        for (let x = x1; x <= x2; ++x)
        {
            if (Math.floor(x) == mainPassageIndex)
                mainPassagePlacementAction(ecs, x, z, levelIndex);
            else
                Random.selectByWeightedChance(randomPlacementActions, randomPlacementChanceWeights)(ecs, x, z, levelIndex);
        }
    }

    static addShooter(ecs: ECSManager, x: number, z: number, levelIndex: number)
    {
        const y = g.worldBoundMin[1] + 0.5;
        LevelFactory.addSpriteEntity(ecs, "shooter", x, y, z);
    }

    static addCube(ecs: ECSManager, x: number, z: number, levelIndex: number)
    {
        const y = g.worldBoundMin[1] + 0.5;
        LevelFactory.addSpriteEntity(ecs, "cube", x, y, z);
    }

    static addColumn(ecs: ECSManager, x: number, z: number, levelIndex: number)
    {
        const y = g.worldBoundMin[1] + 0.5*g.worldBoundSize[1];
        LevelFactory.addSpriteEntity(ecs, "column", x, y, z);
    }

    static addNone(ecs: ECSManager, x: number, z: number, levelIndex: number)
    {
    }

    static addLevelDoor(ecs: ECSManager, x: number, z: number, levelIndex: number)
    {
        // Level Portal
        const levelPortalEntity = LevelFactory.addSpriteEntity(ecs, "levelPortal", x, g.worldBoundMin[1] + 1, z);
        const levelPortal = ecs.getComponent(levelPortalEntity.id, "LevelPortalComponent") as LevelPortalComponent;
        levelPortal.newLevelIndex = levelIndex + 1;
    }

    static addSpriteEntity(ecs: ECSManager, entityConfigId: string,
        x: number, y: number, z: number): Entity
    {
        const entity = ecs.addEntity(entityConfigId);
        const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
        vec3.set(tr.position, x, y, z);
        tr.matrixSynced = false;
        return entity;
    }

    private static setRotation(ecs: ECSManager, entity: Entity, xr: number, yr: number, zr: number)
    {
        const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
        vec3.set(tr.rotation, xr, yr, zr);
    }

    private static setFloorSpriteDims(ecs: ECSManager, entity: Entity, levelIndex: number)
    {
        const sprite = ecs.getComponent(entity.id, "SpriteComponent") as SpriteComponent;
        vec2.set(sprite.uvShift, 14*s, 8*s);
    }
    private static setWallSpriteDims(ecs: ECSManager, entity: Entity, levelIndex: number)
    {
        const sprite = ecs.getComponent(entity.id, "SpriteComponent") as SpriteComponent;
        vec2.set(sprite.uvShift, 13*s, 8*s);
    }
    private static setCeilingSpriteDims(ecs: ECSManager, entity: Entity, levelIndex: number)
    {
        const sprite = ecs.getComponent(entity.id, "SpriteComponent") as SpriteComponent;
        vec2.set(sprite.uvShift, 11*s, 8*s);
    }
}