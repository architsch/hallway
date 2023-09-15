import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import { LevelChangeSignalComponent, LevelComponent, LevelMemberComponent } from "../Models/GameComponents";
import { vec3 } from "gl-matrix";
import LevelFactory from "../Factories/LevelFactory";

export default class LevelChangeSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Level", ["Level"]],
            ["LevelChangeSignal", ["LevelChangeSignal"]],
            ["LevelMember", ["LevelMember"]],
        ];
    }

    start(ecs: ECSManager)
    {
        this.createInitialLevel(ecs);
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const g = globalPropertiesConfig;

        const levelEntities = this.queryEntityGroup("Level");
        const signalEntities = this.queryEntityGroup("LevelChangeSignal");
        const levelMemberEntities = this.queryEntityGroup("LevelMember");

        let currLevelIndex = -1;
        let newLevelIndex = -1;

        levelEntities.forEach((entity: Entity) => {
            const level = ecs.getComponent(entity.id, "Level") as LevelComponent;
            currLevelIndex = level.levelIndex;
        });
        signalEntities.forEach((entity: Entity) => {
            const signal = ecs.getComponent(entity.id, "LevelChangeSignal") as LevelChangeSignalComponent;
            newLevelIndex = signal.newLevelIndex;
        });

        if (currLevelIndex < 0 && newLevelIndex < 0) // No level yet
        {
            throw new Error(`No level loaded.`);
        }
        else if (newLevelIndex >= 0) // Level-change signal detected
        {
            levelMemberEntities.forEach((entity: Entity) => {
                const levelMember = ecs.getComponent(entity.id, "LevelMember") as LevelMemberComponent;
                if (levelMember.levelIndex == currLevelIndex)
                {
                    if (levelMember.carryoverPending)
                    {
                        levelMember.carryoverPending = false;
                        levelMember.levelIndex = newLevelIndex;
                        if (ecs.hasComponent(entity.id, "Transform"))
                        {
                            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
                            vec3.set(tr.position, tr.position[0], tr.position[1], tr.position[2] - g.worldChunkSize[2] * (g.numWorldChunks-1));
                        }
                    }
                    else
                    {
                        ecs.removeEntity(entity.id);
                    }
                }
            });
            levelEntities.forEach((entity: Entity) => {
                ecs.removeEntity(entity.id);
            });
            ecs.clearRemovePendingEntities();
            this.createLevel(ecs, newLevelIndex);
        }
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private createLevel(ecs: ECSManager, levelIndex: number)
    {
        const g = globalPropertiesConfig;
        for (let chunkIndex = 0; chunkIndex < g.numWorldChunks; ++chunkIndex)
            LevelFactory.addWorldChunk(ecs, levelIndex, chunkIndex);

        const levelEntity = ecs.addEntity("empty");
        const levelComponent = ecs.addComponent(levelEntity.id, "Level") as LevelComponent;
        levelComponent.levelIndex = levelIndex;
    }

    private createInitialLevel(ecs: ECSManager)
    {
        const g = globalPropertiesConfig;

        ecs.addEntity("worldBoundFloorCollider");
        ecs.addEntity("worldBoundCeilingCollider");
        ecs.addEntity("worldBoundLeftWallCollider");
        ecs.addEntity("worldBoundRightWallCollider");
        ecs.addEntity("worldBoundBackWallCollider");
        ecs.addEntity("worldBoundFrontWallCollider");

        LevelFactory.addWorldChunk(ecs, 0, g.numWorldChunks-1);
        // TODO: Spawn a backstep-prevention collider.
        
        // Player
        const playerY = g.worldBoundMin[1] + 5;
        const player = ecs.addEntity("player");
        const playerTr = ecs.getComponent(player.id, "Transform") as TransformComponent;
        vec3.set(playerTr.position,
            0.5 * (g.worldBoundMin[0] + g.worldBoundMax[0]), playerY, g.worldChunkSize[2] * (g.numWorldChunks-1));
        vec3.set(playerTr.rotation, 0, 180, 0);
        playerTr.matrixSynced = false;

        // Light
        ecs.addEntity("mainLight");

        // Level
        const levelEntity = ecs.addEntity("empty");
        const levelComponent = ecs.addComponent(levelEntity.id, "Level") as LevelComponent;
        levelComponent.levelIndex = 0;
    }
}