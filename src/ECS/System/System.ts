import ECSManager from "../ECSManager";
import Entity from "../Entity/Entity";

export default abstract class System
{
    entities: Set<Entity> = new Set<Entity>();
    requiredComponentTypes: Set<string> = new Set<string>();

    abstract update(ecs: ECSManager, t: number, dt: number): void;

    onEntityModified(ecs: ECSManager, entity: Entity)
    {
        let matchCount = 0;
        for (const componentType of Object.keys(entity.componentIds))
        {
            if (this.requiredComponentTypes.has(componentType))
                matchCount++;
        }

        if (matchCount >= this.requiredComponentTypes.size)
        {
            if (!this.entities.has(entity))
            {
                this.entities.add(entity);
                this.onEntityRegistered(ecs, entity);
            }
        }
        else
        {
            if (this.entities.has(entity))
            {
                this.entities.delete(entity);
                this.onEntityUnregistered(ecs, entity);
            }
        }
    }

    protected abstract onEntityRegistered(ecs: ECSManager, entity: Entity): void;
    protected abstract onEntityUnregistered(ecs: ECSManager, entity: Entity): void;
}