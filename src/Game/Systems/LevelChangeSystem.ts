import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import { LevelComponent, LevelPortalComponent } from "../Models/LevelComponents";
import { vec3 } from "gl-matrix";
import LevelFactory from "../Factories/LevelFactory";

const g = globalPropertiesConfig;

export default class LevelChangeSystem extends System
{
    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["LevelComponent", ["LevelComponent"]],
            ["TransformComponent", ["TransformComponent"]],
            ["CollisionEventComponent", ["CollisionEventComponent"]],
            ["PlayerComponent", ["PlayerComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
        ecs.addEntity("worldBoundFloorCollider");
        ecs.addEntity("worldBoundCeilingCollider");
        ecs.addEntity("worldBoundLeftWallCollider");
        ecs.addEntity("worldBoundRightWallCollider");
        ecs.addEntity("worldBoundBackWallCollider");
        ecs.addEntity("worldBoundFrontWallCollider");
        ecs.addEntity("player");
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        let currLevelIndex = -1;
        let newLevelIndex = -1;

        this.queryEntityGroup("LevelComponent").forEach((entity: Entity) => {
            const level = ecs.getComponent(entity.id, "LevelComponent") as LevelComponent;
            currLevelIndex = level.levelIndex;
        });

        if (currLevelIndex < 0)
        {
            if (this.queryEntityGroup("PlayerComponent").size > 0)
                this.loadLevel(ecs, 0);
            return;
        }

        this.queryEntityGroup("CollisionEventComponent").forEach((entity: Entity) => {
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
            return;
        else if (newLevelIndex >= 0) // Level-change signal detected
            this.loadLevel(ecs, newLevelIndex);
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private loadLevel(ecs: ECSManager, levelIndex: number)
    {
        this.queryEntityGroup("TransformComponent").forEach((entity: Entity) => {
            if (!ecs.hasComponent(entity.id, "DontRemoveOnLevelChangeComponent"))
                ecs.removeEntity(entity.id);
        });
        this.queryEntityGroup("LevelComponent").forEach((entity: Entity) => {
            ecs.removeEntity(entity.id);
        });

        let levelEntranceZ: number;

        this.queryEntityGroup("PlayerComponent").forEach((entity: Entity) => {
            const playerTr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
            levelEntranceZ = g.worldBoundMin[2] + 0.5*g.playerBoundingBoxSize[2] + ((levelIndex == 0) ? 0.75 : g.worldBoundMax[2] - playerTr.position[2]);
            vec3.set(playerTr.position,
                playerTr.position[0],
                playerTr.position[1],
                g.worldBoundMin[2] + 0.5*g.playerBoundingBoxSize[2]);
            playerTr.matrixSynced = false;
        });
        LevelFactory.populate(ecs, levelIndex, levelEntranceZ);

        const levelEntity = ecs.addEntity("empty");
        const levelComponent = ecs.addComponent(levelEntity.id, "LevelComponent") as LevelComponent;
        levelComponent.levelIndex = levelIndex;
    }
}