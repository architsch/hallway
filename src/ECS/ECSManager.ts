import Pool from "../Util/Pooling/Pool";
import Entity from "./Entity";
import { Component, ComponentBitMask, ComponentCache, ComponentTypeBitMasks } from "./Component";
import System from "./System";
import { globalConfig } from "../Config/GlobalConfig";
import { mat2, mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";
import GraphicsInitSystem from "../Graphics/Systems/GraphicsInitSystem";
import KeyInputSystem from "../Input/Systems/KeyInputSystem";
import PlayerControlSystem from "../Game/Systems/Core/PlayerControlSystem";
import CameraMatrixSyncSystem from "../Graphics/Systems/CameraMatrixSyncSystem";
import KinematicsSystem from "../Physics/Systems/KinematicsSystem";
import TransformMatrixSyncSystem from "../Physics/Systems/TransformMatrixSyncSystem";
import MeshRenderSystem from "../Graphics/Systems/MeshRenderSystem";
import MeshInstanceIndexingSystem from "../Graphics/Systems/MeshInstanceIndexingSystem";
import UniformSystem from "../Graphics/Systems/UniformSystem";
import LightMatrixSyncSystem from "../Graphics/Systems/LightMatrixSyncSystem";
import CollisionDetectionSystem from "../Physics/Systems/CollisionDetectionSystem";
import MechanicalForceSystem from "../Physics/Systems/MechanicalForceSystem";
import ColliderRenderSystem from "../Graphics/Systems/ColliderRenderSystem";
import { globalPropertiesConfig } from "../Config/GlobalPropertiesConfig";
import LevelChangeSystem from "../Game/Systems/Core/LevelChangeSystem";
import AnimatedSpriteFramingSystem from "../Graphics/Systems/AnimatedSpriteFramingSystem";
import TransformChildSyncSystem from "../Physics/Systems/TransformChildSyncSystem";
import ForceFieldSystem from "../Physics/Systems/ForceFieldSystem";
import DieSystem from "../Game/Systems/Dynamic/DieSystem";
import SpawnSystem from "../Game/Systems/Dynamic/SpawnSystem";
import ECSCommand from "./ECSCommand";

export default class ECSManager
{
    private entityPool: Pool<Entity>;
    private commandPool: Pool<ECSCommand>;
    private pendingCommands: Array<ECSCommand>;
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
        this.commandPool = new Pool<ECSCommand>("ECSCommand", g.maxNumEntities, () => {
            return {
                id: undefined,
                commandType: undefined,
                entityId: undefined,
                componentType: undefined,
            } as ECSCommand;
        })
        this.pendingCommands = new Array<ECSCommand>();

        this.systems = [];

        //######################################################################
        // Phase 1 (Physics)
        //######################################################################
        this.systems.push(new CollisionDetectionSystem());
        this.systems.push(new MechanicalForceSystem());
        this.systems.push(new ForceFieldSystem());
        this.systems.push(new KinematicsSystem());
        this.systems.push(new TransformChildSyncSystem());
        this.systems.push(new TransformMatrixSyncSystem());

        //######################################################################
        // Phase 2 (Gameplay)
        //######################################################################
        this.systems.push(new KeyInputSystem());
        this.systems.push(new LevelChangeSystem());
        this.systems.push(new PlayerControlSystem());
        this.systems.push(new CameraMatrixSyncSystem());
        this.systems.push(new LightMatrixSyncSystem());
        this.systems.push(new SpawnSystem());
        this.systems.push(new DieSystem());

        //######################################################################
        // Phase 3 (Graphics)
        //######################################################################
        this.systems.push(new GraphicsInitSystem());
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
        // Update systems
        for (const system of this.systems)
            system.update(this, t, dt);

        // Process pending commands
        for (const command of this.pendingCommands)
        {
            const entity = this.entityPool.get(command.entityId);

            switch (command.commandType)
            {
                case "addEntity":
                    break;
                case "removeEntity":
                    entity.componentBitMask.clear();
                    this.entityPool.return(entity.id);
                    break;
                case "addComponent":
                    entity.componentBitMask.addMask(ComponentTypeBitMasks[command.componentType]);
                    break;
                case "removeComponent":
                    entity.componentBitMask.removeMask(ComponentTypeBitMasks[command.componentType]);
                    break;
                default:
                    throw new Error(`Unknown command type :: "${command.commandType}"`);
            }
            this.reregisterEntity(entity);
            this.commandPool.return(command.id);
        }
        this.pendingCommands.length = 0;
    }

    getEntity(id: number): Entity
    {
        return this.entityPool.get(id);
    }

    addEntity(configId: string): Entity
    {
        const entity = this.entityPool.rent();
        if (entity.alive)
            throw new Error(`Entity (id = ${entity.id}) is already alive.`);
        entity.alive = true;

        const entityConfig = globalConfig.entityConfigById[configId];
        if (entityConfig == undefined)
            throw new Error(`Entity config not found (id = ${configId})`);
        for (const [componentType, componentValues] of Object.entries(entityConfig))
        {
            this.initComponent(entity.id, componentType, componentValues);
            entity.componentBitMask.addMask(ComponentTypeBitMasks[componentType]);
        }
        const command = this.commandPool.rent();
        command.commandType = "addEntity";
        command.entityId = entity.id;
        command.componentType = undefined;
        this.pendingCommands.push(command);
        return entity;
    }

    removeEntity(id: number)
    {
        const entity = this.entityPool.get(id);
        if (entity.alive)
        {
            entity.alive = false;
            const command = this.commandPool.rent();
            command.commandType = "removeEntity";
            command.entityId = entity.id;
            command.componentType = undefined;
            this.pendingCommands.push(command);
        }
    }

    addComponent(entityId: number, componentType: string): Component
    {
        const component = this.initComponent(entityId, componentType);
        const command = this.commandPool.rent();
        command.commandType = "addComponent";
        command.entityId = entityId;
        command.componentType = componentType;
        this.pendingCommands.push(command);
        return component;
    }

    removeComponent(entityId: number, componentType: string)
    {
        const command = this.commandPool.rent();
        command.commandType = "removeComponent";
        command.entityId = entityId;
        command.componentType = componentType;
        this.pendingCommands.push(command);
    }

    getComponent(entityId: number, componentType: string): Component
    {
        return ComponentCache[componentType][entityId];
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
}