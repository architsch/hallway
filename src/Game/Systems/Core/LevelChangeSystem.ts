import ECSManager from "../../../ECS/ECSManager";
import Entity from "../../../ECS/Entity";
import System from "../../../ECS/System";
import { CollisionEventComponent, TransformComponent } from "../../../Physics/Models/PhysicsComponents";
import { globalPropertiesConfig } from "../../../Config/GlobalPropertiesConfig";
import { LevelComponent, LevelMemberComponent, LevelPortalComponent } from "../../Models/LevelComponents";
import { vec3 } from "gl-matrix";
import LevelFactory from "../../Factories/LevelFactory";

export default class LevelChangeSystem extends System
{
    private creationPendingLevelIndex = -1;

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["LevelComponent", ["LevelComponent"]],
            ["LevelMemberComponent", ["LevelMemberComponent"]],
            ["CollisionEventComponent", ["CollisionEventComponent"]],
            ["TransformComponent", ["TransformComponent"]],
            ["PlayerComponent", ["PlayerComponent"]],
            ["BackWallComponent", ["BackWallComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
        this.createInitialLevel(ecs);
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const g = globalPropertiesConfig;

        if (this.creationPendingLevelIndex >= 0)
        {
            this.createLevel(ecs, this.creationPendingLevelIndex);
            this.creationPendingLevelIndex = -1;
        }

        const levelEntities = this.queryEntityGroup("LevelComponent");
        const eventEntities = this.queryEntityGroup("CollisionEventComponent");

        let currLevelIndex = -1;
        let newLevelIndex = -1;

        levelEntities.forEach((entity: Entity) => {
            const level = ecs.getComponent(entity.id, "LevelComponent") as LevelComponent;
            currLevelIndex = level.levelIndex;
        });
        eventEntities.forEach((entity: Entity) => {
            const event = ecs.getComponent(entity.id, "CollisionEventComponent") as CollisionEventComponent;
            
            let levelPortalEntityId = -1;

            if (ecs.hasComponent(event.entityId1, "PlayerComponent") && ecs.hasComponent(event.entityId2, "LevelPortalComponent"))
                levelPortalEntityId = event.entityId2;
            else if (ecs.hasComponent(event.entityId1, "LevelPortalComponent") && ecs.hasComponent(event.entityId2, "PlayerComponent"))
                levelPortalEntityId = event.entityId1;

            if (levelPortalEntityId >= 0)
            {
                const levelPortal = ecs.getComponent(levelPortalEntityId, "LevelPortalComponent") as LevelPortalComponent;
                newLevelIndex = levelPortal.newLevelIndex;
                if (newLevelIndex < 0)
                    throw new Error(`LevelPortalComponent does not have a valid level index (levelPortal.newLevelIndex = ${newLevelIndex}).`);
                console.log(`Level Changed :: ${currLevelIndex} -> ${newLevelIndex}`);
            }
        });

        if (currLevelIndex < 0 && newLevelIndex < 0) // No level yet
        {
            return;
        }
        else if (newLevelIndex >= 0) // Level-change signal detected
        {
            this.queryEntityGroup("LevelMemberComponent").forEach((entity: Entity) => {
                const levelMember = ecs.getComponent(entity.id, "LevelMemberComponent") as LevelMemberComponent;
                if (levelMember.levelIndex == currLevelIndex)
                    ecs.removeEntity(entity.id);
            });
            levelEntities.forEach((entity: Entity) => {
                ecs.removeEntity(entity.id);
            });

            this.queryEntityGroup("TransformComponent").forEach((entity: Entity) => {
                if (!ecs.hasComponent(entity.id, "DontDisplaceOnLevelChangeComponent"))
                {
                    const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
                    vec3.set(tr.position, tr.position[0], tr.position[1], tr.position[2] - g.worldChunkSize[2] * (g.numWorldChunks-1));
                    tr.matrixSynced = false;
                }
            });

            let playerPos: vec3;
            this.queryEntityGroup("PlayerComponent").forEach((entity: Entity) => {
                const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
                playerPos = tr.position;
            });
            this.queryEntityGroup("BackWallComponent").forEach((entity: Entity) => {
                const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
                vec3.set(tr.position, tr.position[0], tr.position[1], playerPos[2] - 0.5*g.playerBoundingBoxSize[2] - 0.5*g.worldBoundColliderThickness);
                tr.matrixSynced = false;
            });

            this.creationPendingLevelIndex = newLevelIndex;
        }
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private createLevel(ecs: ECSManager, levelIndex: number)
    {
        const g = globalPropertiesConfig;
        for (let chunkIndex = 1; chunkIndex < g.numWorldChunks; ++chunkIndex)
            LevelFactory.addWorldChunk(ecs, levelIndex, chunkIndex);

        const levelEntity = ecs.addEntity("empty");
        const levelComponent = ecs.addComponent(levelEntity.id, "LevelComponent") as LevelComponent;
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
        ecs.addEntity("backWallCollider");
        ecs.addEntity("player");
        ecs.addEntity("mainLight");

        LevelFactory.addWorldChunk(ecs, 0, g.numWorldChunks-1);

        const levelEntity = ecs.addEntity("empty");
        const levelComponent = ecs.addComponent(levelEntity.id, "LevelComponent") as LevelComponent;
        levelComponent.levelIndex = 0;
    }
}