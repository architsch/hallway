import ComponentPools from "./Component/ComponentPools";
import Pool from "../Util/Pooling/Pool";
import Entity from "./Entity/Entity";
import { EntityTypes } from "./Entity/EntityTypes";
import System from "./System/System";
import MeshSyncSystem from "./System/MeshSyncSystem";
import { Component } from "./Component/Components";
import TransformUpdateSystem from "./System/TransformUpdateSystem";

export default class ECSManager
{
    private entityPool: Pool<Entity>;
    private systems: Array<System>;

    constructor()
    {
        this.entityPool = new Pool<Entity>(256, () => { return {id: undefined, componentIds: {}}; });
        this.systems = new Array<System>();
        this.systems.push(new TransformUpdateSystem());
        this.systems.push(new MeshSyncSystem());
    }

    update(t: number, dt: number)
    {
        for (const system of this.systems)
            system.update(this, t, dt);
    }

    getEntity(id: number): Entity
    {
        return this.entityPool.get(id);
    }

    addEntity(type: string): Entity
    {
        const entity = this.entityPool.rent();
        const entityType = EntityTypes[type];
        for (const {componentType, componentValues} of entityType)
            this.addComponent(entity.id, componentType, componentValues);
        return entity;
    }

    removeEntity(id: number)
    {
        const entity = this.entityPool.get(id);
        for (const componentType of Object.keys(entity.componentIds))
            this.removeComponent(entity.id, componentType);
        this.entityPool.return(entity.id);
    }

    getComponent(entityId: number, componentType: string): Component
    {
        const entity = this.entityPool.get(entityId);
        return ComponentPools[componentType].get(entity.componentIds[componentType]);
    }

    addComponent(entityId: number, componentType: string, componentValues: any)
    {
        const entity = this.entityPool.get(entityId);
        const component = ComponentPools[componentType].rent();
        component.entityId = entityId;
        Object.assign(component, componentValues);
        entity.componentIds[componentType] = component.id;

        for (const system of this.systems)
            system.onEntityModified(this, entity);
    }

    removeComponent(entityId: number, componentType: string)
    {
        const entity = this.entityPool.get(entityId);
        ComponentPools[componentType].return(entity.componentIds[componentType]);
        delete entity.componentIds[componentType];

        for (const system of this.systems)
            system.onEntityModified(this, entity);
    }
}