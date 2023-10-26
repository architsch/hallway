import Pool from "../Util/Pooling/Pool";
import Entity from "./Entity";
import { Component, ComponentBitMask, ComponentCache, ComponentInstantiationMethods, ComponentTypeBitMasks } from "./Component";
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
import UniformSystem from "../Graphics/Systems/UniformSystem";
import CollisionDetectionSystem from "../Physics/Systems/CollisionDetectionSystem";
import CollisionForceSystem from "../Physics/Systems/CollisionForceSystem";
import ColliderRenderSystem from "../Graphics/Systems/ColliderRenderSystem";
import { globalPropertiesConfig } from "../Config/GlobalPropertiesConfig";
import LevelLoadingSystem from "../Game/Systems/LevelLoadingSystem";
import AnimatedSpriteFramingSystem from "../Graphics/Systems/AnimatedSpriteFramingSystem";
import TransformChildSyncSystem from "../Physics/Systems/TransformChildSyncSystem";
import ForceFieldSystem from "../Physics/Systems/ForceFieldSystem";
import DieSystem from "../Game/Systems/DieSystem";
import SpawnSystem from "../Game/Systems/SpawnSystem";
import ECSCommand from "./ECSCommand";
import WaypointSystem from "../Game/Systems/WaypointSystem";

export default class ECSManager
{
    private entityPool: Pool<Entity>;
    private commandPool: Pool<ECSCommand>;
    private pendingRemoveEntityCommands: Array<ECSCommand>;
    private pendingRemoveComponentCommands: Array<ECSCommand>;
    private pendingAddEntityCommands: Array<ECSCommand>;
    private pendingAddComponentCommands: Array<ECSCommand>;
    private systems: Array<System>;

    constructor()
    {
        const g = globalPropertiesConfig;

        this.entityPool = new Pool<Entity>("Entity", g.maxNumEntities, () => {
            return {
                id: undefined,
                componentBitMask: new ComponentBitMask(),
                alive: false,
            } as Entity;
        });
        this.commandPool = new Pool<ECSCommand>("ECSCommand", 2 * g.maxNumEntities, () => {
            return {
                id: undefined,
                entityId: undefined,
                componentType: undefined,
            } as ECSCommand;
        })
        this.pendingRemoveEntityCommands = new Array<ECSCommand>();
        this.pendingRemoveComponentCommands = new Array<ECSCommand>();
        this.pendingAddEntityCommands = new Array<ECSCommand>();
        this.pendingAddComponentCommands = new Array<ECSCommand>();

        this.systems = [];

        //######################################################################
        // Phase 1 (Physics)
        //######################################################################
        
        this.systems.push(new CollisionDetectionSystem());
        this.systems.push(new CollisionForceSystem());
        this.systems.push(new ForceFieldSystem());
        this.systems.push(new KinematicsSystem());
        this.systems.push(new TransformChildSyncSystem());
        this.systems.push(new TransformMatrixSyncSystem());

        //######################################################################
        // Phase 2 (Gameplay)
        //######################################################################
        this.systems.push(new LevelLoadingSystem());
        this.systems.push(new KeyInputSystem());
        this.systems.push(new PlayerControlSystem());
        this.systems.push(new SpawnSystem());
        this.systems.push(new DieSystem());
        this.systems.push(new WaypointSystem());

        //######################################################################
        // Phase 3 (Graphics)
        //######################################################################
        this.systems.push(new GraphicsInitSystem());
        this.systems.push(new CameraMatrixSyncSystem());
        this.systems.push(new UniformSystem());
        this.systems.push(new MeshInstanceIndexingSystem());
        this.systems.push(new AnimatedSpriteFramingSystem());
        this.systems.push(new MeshRenderSystem());
        if (g.debugEnabled)
            this.systems.push(new ColliderRenderSystem());

        for (const system of this.systems)
            system.start(this);
    }

    update(t: number, dt: number)
    {
        this.processAllPendingCommands();
        for (const system of this.systems)
            system.update(this, t, dt);
    }

    getEntity(id: number): Entity
    {
        return this.entityPool.get(id);
    }

    addEntity(configId: string): Entity
    {
        const entity = this.entityPool.rent();
        entity.configId = configId; // for debugging purposes
        if (entity.alive)
            throw new Error(`Entity (id = ${entity.id}) is already alive.`);

        const entityConfig = globalConfig.entityConfigById[configId];
        if (entityConfig == undefined)
            throw new Error(`Entity config not found (id = ${configId})`);

        for (const [componentType, componentValues] of Object.entries(entityConfig))
        {
            this.initComponent(entity.id, componentType, componentValues);
            entity.componentBitMask.addMask(ComponentTypeBitMasks[componentType]);
        }
        const command = this.commandPool.rent();
        command.entityId = entity.id;
        command.componentType = undefined;
        this.pendingAddEntityCommands.push(command);
        return entity;
    }

    removeEntity(id: number)
    {
        const command = this.commandPool.rent();
        command.entityId = id;
        command.componentType = undefined;
        this.pendingRemoveEntityCommands.push(command);
    }

    addComponent(entityId: number, componentType: string): Component
    {
        const component = this.initComponent(entityId, componentType);
        const command = this.commandPool.rent();
        command.entityId = entityId;
        command.componentType = componentType;
        this.pendingAddComponentCommands.push(command);
        return component;
    }

    removeComponent(entityId: number, componentType: string)
    {
        const command = this.commandPool.rent();
        command.entityId = entityId;
        command.componentType = componentType;
        this.pendingRemoveComponentCommands.push(command);
    }

    getComponent(entityId: number, componentType: string): Component
    {
        const cache = ComponentCache[componentType];
        while (entityId >= cache.length)
            cache.push(ComponentInstantiationMethods[componentType]());
        return cache[entityId];
    }

    hasComponent(entityId: number, componentType: string): boolean
    {
        const entity = this.getEntity(entityId);
        return entity.componentBitMask.hasAllComponentsInMask(ComponentTypeBitMasks[componentType]);
    }

    private initComponent(entityId: number, componentType: string, componentValues: {[key: string]: [type: string, value: any]} | undefined = undefined): Component
    {
        if (ComponentCache[componentType] == undefined)
            throw new Error(`Component type "${componentType}" doesn't exist in ComponentCache.`);
        const component = this.getComponent(entityId, componentType);
        component.applyDefaultValues();

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
        return component;
    }

    private reregisterEntity(entity: Entity)
    {
        for (const system of this.systems)
            system.reregisterEntity(this, entity);
    }

    // Last-command processing methods

    processLastPendingAddEntityCommand()
    {
        this.processAddEntityCommand(this.pendingAddEntityCommands.pop());
    }
    processLastPendingRemoveEntityCommand()
    {
        this.processRemoveEntityCommand(this.pendingRemoveEntityCommands.pop());
    }
    processLastPendingAddComponentCommand()
    {
        this.processAddComponentCommand(this.pendingAddComponentCommands.pop());
    }
    processLastPendingRemoveComponentCommand()
    {
        this.processRemoveComponentCommand(this.pendingRemoveComponentCommands.pop());
    }

    // All-command processing methods

    private processAllPendingCommands()
    {
        this.processAllPendingAddEntityCommands();
        this.processAllPendingAddComponentCommands();
        this.processAllPendingRemoveComponentCommands();
        this.processAllPendingRemoveEntityCommands();
    }
    private processAllPendingAddEntityCommands()
    {
        for (const command of this.pendingAddEntityCommands)
            this.processAddEntityCommand(command);
        this.pendingAddEntityCommands.length = 0;
    }
    private processAllPendingRemoveEntityCommands()
    {
        for (const command of this.pendingRemoveEntityCommands)
            this.processRemoveEntityCommand(command);
        this.pendingRemoveEntityCommands.length = 0;
    }
    private processAllPendingAddComponentCommands()
    {
        for (const command of this.pendingAddComponentCommands)
            this.processAddComponentCommand(command);
        this.pendingAddComponentCommands.length = 0;
    }
    private processAllPendingRemoveComponentCommands()
    {
        for (const command of this.pendingRemoveComponentCommands)
            this.processRemoveComponentCommand(command);
        this.pendingRemoveComponentCommands.length = 0;
    }

    // Individual command processing methods

    private processAddEntityCommand(command: ECSCommand)
    {
        const entity = this.entityPool.get(command.entityId);
        if (entity.alive)
            throw new Error(`Entity is already alive (entityId = ${command.entityId})`);
        entity.alive = true;
        this.reregisterEntity(entity);
        this.commandPool.return(command.id);
    }
    private processRemoveEntityCommand(command: ECSCommand)
    {
        const entity = this.entityPool.get(command.entityId);
        if (!entity.alive)
        {
            console.warn(`Entity is already dead (entityId = ${command.entityId})`);
            return;
        }
        entity.alive = false;
        entity.componentBitMask.clear();
        this.entityPool.return(entity.id);
        this.reregisterEntity(entity);
        this.commandPool.return(command.id);
    }
    private processAddComponentCommand(command: ECSCommand)
    {
        const entity = this.entityPool.get(command.entityId);
        if (!entity.alive)
            throw new Error(`Entity is not alive (entityId = ${command.entityId}, componentType = ${command.componentType})`);
        entity.componentBitMask.addMask(ComponentTypeBitMasks[command.componentType]);
        this.reregisterEntity(entity);
        this.commandPool.return(command.id);
    }
    private processRemoveComponentCommand(command: ECSCommand)
    {
        const entity = this.entityPool.get(command.entityId);
        if (!entity.alive)
            throw new Error(`Entity is not alive (entityId = ${command.entityId}, componentType = ${command.componentType})`);
        entity.componentBitMask.removeMask(ComponentTypeBitMasks[command.componentType]);
        this.reregisterEntity(entity);
        this.commandPool.return(command.id);
    }
}