import { ComponentBitMask, ComponentTypeBitMasks } from "./Component";
import ECSManager from "./ECSManager";
import Entity from "./Entity";

export default abstract class System
{
    protected entityGroups: {[groupId: string]: Set<Entity>};
    protected componentBitMaskByEntityGroup: {[groupId: string]: ComponentBitMask};

    constructor()
    {
        this.entityGroups = {};
        this.componentBitMaskByEntityGroup = {};
        const kvps = this.getCriteria();

        for (const [groupId, requiredComponentTypes] of kvps)
        {
            this.entityGroups[groupId] = new Set<Entity>();

            const mask = new ComponentBitMask();
            this.componentBitMaskByEntityGroup[groupId] = mask;
            for (const componentType of requiredComponentTypes)
                mask.addMask(ComponentTypeBitMasks[componentType]);
        }
    }

    protected abstract getCriteria(): [groupId: string, requiredComponentTypes: string[]][];
    abstract start(ecs: ECSManager): void;
    abstract update(ecs: ECSManager, t: number, dt: number): void;
    protected abstract onEntityRegistered(ecs: ECSManager, entity: Entity): void;
    protected abstract onEntityUnregistered(ecs: ECSManager, entity: Entity): void;

    queryEntityGroup(groupId: string): Set<Entity>
    {
        const entityGroup = this.entityGroups[groupId];
        if (entityGroup == undefined)
            throw new Error(`Entity group doesn't exist (groupId = ${groupId})`);
        return this.entityGroups[groupId];
    }

    // This function is called whenever a component is added to or removed from the given entity.
    reregisterEntity(ecs: ECSManager, entity: Entity)
    {
        for (const [groupId, mask] of Object.entries(this.componentBitMaskByEntityGroup))
        {
            const entityGroup = this.entityGroups[groupId];

            if (entity.componentBitMask.hasAllComponentsInMask(mask))
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