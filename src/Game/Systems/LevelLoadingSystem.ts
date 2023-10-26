import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import LevelFactory from "../Factories/LevelFactory";
import { StatsComponent } from "../Models/CoreComponents";

const g = globalPropertiesConfig;

export default class LevelLoadingSystem extends System
{
    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["StatsComponent", ["StatsComponent"]],
            ["TransformComponent", ["TransformComponent"]],
            ["WaypointComponent", ["WaypointComponent"]],
            ["PlayerComponent", ["PlayerComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
        ecs.addEntity("stats");
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        let currLevel = -1;
        let newLevel = -1;

        this.queryEntityGroup("StatsComponent").forEach((entity: Entity) => {
            const stats = ecs.getComponent(entity.id, "StatsComponent") as StatsComponent;
            currLevel = stats.level;
        });

        // TODO: Set newLevel to a nonnegative value here if you want to change the level.

        if (newLevel >= 0) // Level-change signal detected
        {
            this.loadLevel(ecs, newLevel);
        }
        else if (this.queryEntityGroup("PlayerComponent").size == 0)
        {
            this.loadLevel(ecs, Math.max(0, currLevel));
        }
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private loadLevel(ecs: ECSManager, level: number)
    {
        console.log(`Loading level ${level}...`);

        // Remove obsolete entities
        this.queryEntityGroup("TransformComponent").forEach((entity: Entity) => {
            ecs.removeEntity(entity.id);
            ecs.processLastPendingRemoveEntityCommand();
        });
        this.queryEntityGroup("WaypointComponent").forEach((entity: Entity) => {
            ecs.removeEntity(entity.id);
            ecs.processLastPendingRemoveEntityCommand();
        });

        // Update stat
        this.queryEntityGroup("StatsComponent").forEach((entity: Entity) => {
            const stats = ecs.getComponent(entity.id, "StatsComponent") as StatsComponent;
            stats.level = level;
        });

        // Add player
        ecs.addEntity("player");

        LevelFactory.populate(ecs, level);
    }
}