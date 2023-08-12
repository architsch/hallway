import ECSManager from "./ECSManager";
import Entity from "./Entity";

export default class System
{
    entities: Set<Entity> = new Set<Entity>();
    requiredComponentTypes: Set<string> = new Set<string>();

    update: (ecs: ECSManager, t: number, dt: number) => void;
    onEntityRegistered: (ecs: ECSManager, entity: Entity) => void;
    onEntityUnregistered: (ecs: ECSManager, entity: Entity) => void;

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
}