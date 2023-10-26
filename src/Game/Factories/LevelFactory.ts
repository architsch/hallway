import { vec2, vec3 } from "gl-matrix";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import ECSManager from "../../ECS/ECSManager";
import Random from "../../Util/Math/Random";
import Entity from "../../ECS/Entity";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { SpriteComponent } from "../../Graphics/Models/GraphicsComponents";
import { WaypointTraverserComponent } from "../Models/DynamicComponents";
import WaypointFactory from "./WaypointFactory";

const g = globalPropertiesConfig;
const s = g.spriteAtlasGridCellSize;
const deg2rad = Math.PI / 180;

const worldBoundMargin = 0.6;
const x1 = g.worldBoundMin[0] + worldBoundMargin;
const x2 = g.worldBoundMax[0] - worldBoundMargin;
const y1 = g.worldBoundMin[1] + worldBoundMargin;
const y2 = g.worldBoundMax[1] - worldBoundMargin;
const z1 = g.worldBoundMin[2] + worldBoundMargin;
const z2 = g.worldBoundMax[2] - worldBoundMargin;

export default class LevelFactory
{
    static populate(ecs: ECSManager, level: number)
    {
        // TODO: Revise

        /*const zCenter = 0.5 * (g.worldBoundMin[2] + g.worldBoundMax[2]);
        
        // Floor
        let entity = LevelFactory.addSpriteEntity(ecs, "floor", 0, 0, zCenter);
        LevelFactory.setFloorSpriteDims(ecs, entity, level);
        LevelFactory.setRotation(ecs, entity, -90 * deg2rad, 0, 0);

        // Entrance
        LevelFactory.addBarricadeLine(ecs, z1, level, [LevelFactory.addColumn], [1], LevelFactory.addNone, Math.floor(0.5 * (x1+x2)));

        const playAreaZ1 = g.worldBoundMin[2] + 4;
        const playAreaZ2 = g.worldBoundMax[2] - 2;
        const playBlockSizeZMin = 7;
        const playBlockSizeZMax = 11;

        let currPlayBlockZ1 = playAreaZ1;
        do
        {
            const currPlayBlockSizeZ = Random.randomBetween(playBlockSizeZMin, playBlockSizeZMax);
            LevelFactory.addPlayBlock(ecs, currPlayBlockZ1, currPlayBlockZ1 + currPlayBlockSizeZ, level);
            currPlayBlockZ1 += currPlayBlockSizeZ;
        } while (currPlayBlockZ1 < playAreaZ2);

        if (playAreaZ2 - currPlayBlockZ1 >= playBlockSizeZMin)
        {
            LevelFactory.addPlayBlock(ecs, currPlayBlockZ1, playAreaZ2, level);
        }*/
    }

    static addPlayBlock(ecs: ECSManager, z1: number, z2: number, level: number)
    {
        const zCenter = 0.5 * (z1 + z2);

        LevelFactory.addGuardLine(ecs, zCenter - 1.25, level,
            [LevelFactory.addShooter, () => {}],
            [3, 2]
        );
        LevelFactory.addBarricadeLine(ecs, zCenter, level,
            [LevelFactory.addColumn, LevelFactory.addCube, LevelFactory.addNone],
            [5, 3, 1], LevelFactory.addNone
        );
        LevelFactory.addGuardLine(ecs, zCenter + 1.25, level,
            [LevelFactory.addShooter, () => {}],
            [3, 2]
        );
    }

    static addGuardLine(ecs: ECSManager, z: number, level: number,
        randomPlacementActions: Array<(ecs: ECSManager, x: number, z: number, level: number) => void>,
        randomPlacementChanceWeights: Array<number>)
    {
        Random.selectByWeightedChance(randomPlacementActions, randomPlacementChanceWeights)(ecs, Random.randomIntBetween(x1 + 1, x2 - 1), z, level);
    }

    static addBarricadeLine(ecs: ECSManager, z: number, level: number,
        randomPlacementActions: Array<(ecs: ECSManager, x: number, z: number, level: number) => void>,
        randomPlacementChanceWeights: Array<number>,
        mainPassagePlacementAction: (ecs: ECSManager, x: number, z: number, level: number) => void,
        mainPassageIndex: number = -1)
    {
        if (mainPassageIndex < 0)
            mainPassageIndex = Random.randomIntBetween(x1, x2);
        for (let x = x1; x <= x2; ++x)
        {
            if (Math.floor(x) == mainPassageIndex)
                mainPassagePlacementAction(ecs, x, z, level);
            else
                Random.selectByWeightedChance(randomPlacementActions, randomPlacementChanceWeights)(ecs, x, z, level);
        }
    }

    static addShooter(ecs: ECSManager, x: number, z: number, level: number)
    {
        const y = g.worldBoundMin[1] + 0.5;
        const entity = LevelFactory.addSpriteEntity(ecs, "shooter_explodeOnHit", x, y, z);
        LevelFactory.addLoopingHorizontalLinePath(ecs, entity, y, z);
    }

    static addCube(ecs: ECSManager, x: number, z: number, level: number)
    {
        const y = g.worldBoundMin[1] + 0.5;
        LevelFactory.addSpriteEntity(ecs, "cube", x, y, z);
    }

    static addColumn(ecs: ECSManager, x: number, z: number, level: number)
    {
        const y = g.worldBoundMin[1] + 0.5*g.worldBoundSize[1];
        LevelFactory.addSpriteEntity(ecs, "column", x, y, z);
    }

    static addNone(ecs: ECSManager, x: number, z: number, level: number)
    {
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

    private static addLoopingHorizontalLinePath(ecs: ECSManager, entity: Entity, y: number, z: number)
    {
        ecs.addComponent(entity.id, "WaypointTraverserComponent") as WaypointTraverserComponent;
        WaypointFactory.createPath(ecs, [x1, y, z], [x2, y, z], x2 - x1 + 1, true);
        WaypointFactory.placeTraverserAtNearestWaypoint(ecs, entity.id);
    }

    private static setRotation(ecs: ECSManager, entity: Entity, xr: number, yr: number, zr: number)
    {
        const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
        vec3.set(tr.rotation, xr, yr, zr);
    }

    private static setFloorSpriteDims(ecs: ECSManager, entity: Entity, level: number)
    {
        const sprite = ecs.getComponent(entity.id, "SpriteComponent") as SpriteComponent;
        vec2.set(sprite.uvShift, 14*s, 8*s);
    }
}