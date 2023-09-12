import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import EntityFactory from "../../ECS/EntityFactory";
import System from "../../ECS/System";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { globalConfig } from "../../Config/GlobalConfig";
import Random from "../../Util/Math/Random";

const deg2rad = Math.PI / 180;
const s = 0.0625;

export default class GameInitSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [];
    }

    start(ecs: ECSManager)
    {
        const g = globalConfig.globalPropertiesConfig;
        const playerY = g.worldBoundMin[1] + 5;

        const player = ecs.addEntity("player");
        const playerTr = ecs.getComponent(player.id, "Transform") as TransformComponent;
        vec3.set(playerTr.position, 0, playerY, g.worldBoundMin[2] + 3);
        vec3.set(playerTr.rotation, 0, 180, 0);
        playerTr.matrixSynced = false;

        ecs.addEntity("mainLight");
        
        ecs.addEntity("worldBoundFloorCollider");
        ecs.addEntity("worldBoundCeilingCollider");
        ecs.addEntity("worldBoundLeftWallCollider");
        ecs.addEntity("worldBoundRightWallCollider");
        ecs.addEntity("worldBoundBackWallCollider");
        ecs.addEntity("worldBoundFrontWallCollider");

        for (let i = 0; i < g.numWorldChunks; ++i)
        {
            const chunkZ1 = g.worldChunkSize[2] * i;
            const chunkZ2 = g.worldChunkSize[2] * (i+1);
            const chunkZCenter = 0.5 * (chunkZ1 + chunkZ2);

            // Floor
            EntityFactory.addSpriteEntity(ecs, "floor",
                0, 0, chunkZCenter,
                -90 * deg2rad, 0, 0, 1, 1, 1,
                s, s, 14*s, 8*s);
            
            // Ceiling
            EntityFactory.addSpriteEntity(ecs, "floor",
                0, g.worldChunkSize[1], chunkZCenter,
                +90 * deg2rad, 0, 0, 1, 1, 1,
                s, s, 11*s, 8*s);
            
            // Left Wall
            EntityFactory.addSpriteEntity(ecs, "wall",
                -0.5*g.worldChunkSize[0], 0.5*g.worldChunkSize[1], chunkZCenter,
                0, 90 * deg2rad, 0, 1, 1, 1,
                s, s, 13*s, 8*s);
            
            // Right Wall
            EntityFactory.addSpriteEntity(ecs, "wall",
                0.5*g.worldChunkSize[0], 0.5*g.worldChunkSize[1], chunkZCenter,
                0, -90 * deg2rad, 0, 1, 1, 1,
                s, s, 13*s, 8*s);
            
            // Actors
            for (let i = 1; i < 4; ++i)
            {
                const x = Random.randomBetween(g.worldBoundMin[0] + 1.5, g.worldBoundMax[0] - 1.5);
                const y = playerY;
                const z = Random.randomBetween(chunkZ1 + 3, chunkZ2 - 3);
                EntityFactory.addSpriteEntity(ecs, "actor", x, y, z, 180 * deg2rad, 180 * deg2rad, 0, 2, 2, 2, 2*s, 2*s, 0*s, 6*s);
            }
        }
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}