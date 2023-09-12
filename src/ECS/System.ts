import ECSManager from "./ECSManager";
import Entity from "./Entity";

export default abstract class System
{
    protected entityGroups: {[groupId: string]: Set<Entity>};
    protected requiredComponentTypesByEntityGroup: {[groupId: string]: Set<string>};

    constructor()
    {
        this.requiredComponentTypesByEntityGroup = {};
        const kvps = this.getCriteria();
        for (const [groupId, requiredComponentTypes] of kvps)
        {
            const set = new Set<string>();
            this.requiredComponentTypesByEntityGroup[groupId] = set;
            for (const componentType of requiredComponentTypes)
                set.add(componentType);
        }

        this.entityGroups = {};
        for (const groupId of Object.keys(this.requiredComponentTypesByEntityGroup))
            this.entityGroups[groupId] = new Set<Entity>();
    }

    protected abstract getCriteria(): [groupId: string, requiredComponentTypes: string[]][];
    abstract start(ecs: ECSManager): void;
    abstract update(ecs: ECSManager, t: number, dt: number): void;
    abstract onEntityRegistered(ecs: ECSManager, entity: Entity): void;
    abstract onEntityUnregistered(ecs: ECSManager, entity: Entity): void;

    queryEntityGroup(groupId: string): Set<Entity>
    {
        return this.entityGroups[groupId];
    }

    onEntityModified(ecs: ECSManager, entity: Entity)
    {
        for (const [groupId, requiredComponentTypes] of Object.entries(this.requiredComponentTypesByEntityGroup))
        {
            const entityGroup = this.entityGroups[groupId];

            let matchCount = 0;
            for (const componentType of Object.keys(entity.componentIds))
            {
                if (requiredComponentTypes.has(componentType))
                    matchCount++;
            }

            if (matchCount == requiredComponentTypes.size)
            {
                if (!entityGroup.has(entity))
                {
                    entityGroup.add(entity);
                    this.onEntityRegistered(ecs, entity);
                }
            }
            else
            {
                if (entityGroup.has(entity))
                {
                    entityGroup.delete(entity);
                    this.onEntityUnregistered(ecs, entity);
                }
            }
        }
    }
}