import ComponentPools from "./ComponentPools";
import Pool from "../Util/Pooling/Pool";
import Entity from "./Entity";
import { Component } from "./Component";
import System from "./System";
import { globalConfig } from "../Config/GlobalConfig";
import { mat2, mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";
import GraphicsInitSystem from "../Graphics/Systems/GraphicsInitSystem";
import KeyInputSystem from "../Input/Systems/KeyInputSystem";
import PlayerControlSystem from "../Game/Systems/PlayerControlSystem";
import CameraMatrixSyncSystem from "../Graphics/Systems/CameraMatrixSyncSystem";
import KinematicsSystem from "../Physics/Systems/KinematicsSystem";
import TransformMatrixSyncSystem from "../Physics/Systems/TransformMatrixSyncSystem";
import MeshRenderSystem from "../Graphics/Systems/MeshRenderSystem";
import MeshInstanceIndexingSystem from "../Graphics/Systems/MeshInstanceIndexingSystem";
import SingletonComponentAccessSystem from "../Graphics/Systems/SingletonComponentAccessSystem";
import LightMatrixSyncSystem from "../Graphics/Systems/LightMatrixSyncSystem";
import { TransformComponent } from "../Physics/Models/PhysicsComponents";
import CollisionDetectionSystem from "../Physics/Systems/CollisionDetectionSystem";
import CollisionForceSystem from "../Physics/Systems/CollisionForceSystem";
import ColliderRenderSystem from "../Graphics/Systems/ColliderRenderSystem";
import { globalPropertiesConfig } from "../Config/GlobalPropertiesConfig";
import PathfindingSystem from "../AI/Systems/PathfindingSystem";
import LevelChangeSystem from "../Game/Systems/LevelChangeSystem";
import AnimatedSpriteFramingSystem from "../Graphics/Systems/AnimatedSpriteFramingSystem";
import DelayedSelfRemoverSystem from "../Game/Systems/DelayedSelfRemoverSystem";

export default class ECSManager
{
    private entityPool: Pool<Entity>;
    private removePendingEntityIds: Array<number>;

    private systems: Array<System>;
    private singletonComponentAccessSystem: SingletonComponentAccessSystem;

    constructor()
    {
        const g = globalPropertiesConfig;

        this.entityPool = new Pool<Entity>("Entity", g.maxNumEntities, () => {
            return {
                id: undefined,
                parentId: -1,
                childIds: new Array<number>(),
                componentIds: {},
                alive: false,
            };
        });
        this.removePendingEntityIds = new Array<number>();

        this.singletonComponentAccessSystem = new SingletonComponentAccessSystem();

        this.systems = [];

        // Input/Control
        this.systems.push(new KeyInputSystem());
        this.systems.push(new PlayerControlSystem());
        this.systems.push(new CameraMatrixSyncSystem());
        this.systems.push(new LightMatrixSyncSystem());

        // Physics
        this.systems.push(new CollisionDetectionSystem());
        this.systems.push(new CollisionForceSystem());
        this.systems.push(new KinematicsSystem());
        this.systems.push(new TransformMatrixSyncSystem());

        // Graphics
        this.systems.push(new GraphicsInitSystem());
        this.systems.push(this.singletonComponentAccessSystem);
        this.systems.push(new MeshInstanceIndexingSystem());
        this.systems.push(new AnimatedSpriteFramingSystem());
        this.systems.push(new MeshRenderSystem());
        if (g.debugEnabled)
            this.systems.push(new ColliderRenderSystem());

        // AI
        this.systems.push(new PathfindingSystem());

        // Game
        this.systems.push(new LevelChangeSystem());
        this.systems.push(new DelayedSelfRemoverSystem());

        for (const system of this.systems)
            system.start(this);
    }

    singletonComponents(): SingletonComponentAccessSystem
    {
        return this.singletonComponentAccessSystem;
    }

    update(t: number, dt: number)
    {
        for (const system of this.systems)
        {
            system.update(this, t, dt);
            this.clearRemovePendingEntities();
        }
    }

    clearRemovePendingEntities()
    {
        for (const id of this.removePendingEntityIds)
        {
            const entity = this.entityPool.get(id);
            for (const componentType of Object.keys(entity.componentIds))
                this.removeComponent(entity.id, componentType);
            this.entityPool.return(entity.id);
        }
        this.removePendingEntityIds.length = 0;
    }

    isEntityAlive(id: number): boolean
    {
        return this.getEntity(id).alive;
    }

    getEntity(id: number): Entity
    {
        return this.entityPool.get(id);
    }

    addEntity(configId: string): Entity
    {
        const entity = this.entityPool.rent();
        entity.parentId = -1;
        entity.childIds.length = 0;
        entity.alive = true;

        const entityConfig = globalConfig.entityConfigById[configId];
        if (entityConfig == undefined)
            throw new Error(`Entity config not found (id = ${configId})`);
        
        for (const [componentType, componentValues] of Object.entries(entityConfig))
            this.addComponent(entity.id, componentType, componentValues);
        return entity;
    }

    removeEntity(id: number)
    {
        const entity = this.entityPool.get(id);
        entity.alive = false;
        this.removePendingEntityIds.push(id);
    }

    setParent(entity: Entity, parent: Entity | null)
    {
        if (entity.parentId >= 0) // Detach from the previous parent
        {
            const prevParent = this.getEntity(entity.parentId);
            for (let i = 0; i < prevParent.childIds.length; ++i)
            {
                if (prevParent.childIds[i] == entity.id)
                    prevParent.childIds.splice(i, 1);
            }
        }

        if (parent === null)
        {
            entity.parentId = -1;
        }
        else
        {
            entity.parentId = parent.id;
            parent.childIds.push(entity.id);
        }

        if (this.hasComponent(entity.id, "Transform"))
        {
            const transformComponent = this.getComponent(entity.id, "Transform") as TransformComponent;
            transformComponent.matrixSynced = false;
        }
    }

    getComponent(entityId: number, componentType: string): Component
    {
        const entity = this.entityPool.get(entityId);
        return ComponentPools[componentType].get(entity.componentIds[componentType]);
    }

    hasComponent(entityId: number, componentType: string): boolean
    {
        const entity = this.entityPool.get(entityId);
        return entity.componentIds[componentType] != undefined;
    }

    addComponent(entityId: number, componentType: string, componentValues: {[key: string]: [type: string, value: any]} | undefined = undefined): Component
    {
        const entity = this.entityPool.get(entityId);
        if (ComponentPools[componentType] == undefined)
            throw new Error(`Component type "${componentType}" doesn't exist in ComponentPools.`);
        const component = ComponentPools[componentType].rent();
        component.applyDefaultValues();
        component.entityId = entityId;

        if (componentValues != undefined)
        {
            for (const [key, typeAndValue] of Object.entries(componentValues))
            {
                const type = typeAndValue[0];
                const value = typeAndValue[1];
                switch (type)
                {
                    case "number": case "string": case "boolean": case "any": (component as any)[key] = value; break;
                    case "vec2": vec2.copy((component as any)[key], value); break;
                    case "vec3": vec3.copy((component as any)[key], value); break;
                    case "vec4": vec4.copy((component as any)[key], value); break;
                    case "mat2": mat2.copy((component as any)[key], value); break;
                    case "mat3": mat3.copy((component as any)[key], value); break;
                    case "mat4": mat4.copy((component as any)[key], value); break;
                    default: throw new Error(`Unhandled component field type :: ${type} (in component "${componentType}")`);
                }
            }
        }
        entity.componentIds[componentType] = component.id;

        for (const system of this.systems)
            system.onEntityModified(this, entity, component);
        return component;
    }

    removeComponent(entityId: number, componentType: string)
    {
        const entity = this.entityPool.get(entityId);
        const component = this.getComponent(entityId, componentType);
        ComponentPools[componentType].return(entity.componentIds[componentType]);
        delete entity.componentIds[componentType];

        for (const system of this.systems)
            system.onEntityModified(this, entity, component);
    }
}