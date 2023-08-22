import ComponentPools from "./ComponentPools";
import Pool from "../Util/Pooling/Pool";
import Entity from "./Entity";
import { Component } from "./Components";
import System from "./System";
import { globalConfig } from "../Config/GlobalConfig";
import { mat2, mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";
import GameInitSystem from "../Game/Systems/GameInitSystem";
import GraphicsInitSystem from "../Graphics/Systems/GraphicsInitSystem";
import KeyInputSystem from "../Input/Systems/KeyInputSystem";
import CameraControlSystem from "../Graphics/Systems/CameraControlSystem";
import CameraMatrixSyncSystem from "../Graphics/Systems/CameraMatrixSyncSystem";
import KinematicsSystem from "../Physics/Systems/KinematicsSystem";
import TransformMatrixSyncSystem from "../Physics/Systems/TransformMatrixSyncSystem";
import MeshRenderSystem from "../Graphics/Systems/MeshRenderSystem";

export default class ECSManager
{
    private entityPool: Pool<Entity>;
    private systems: Array<System>;

    constructor()
    {
        this.entityPool = new Pool<Entity>(256, () => { return {id: undefined, componentIds: {}}; });
        
        this.systems = [
            // Input/Control
            new KeyInputSystem(),
            new CameraControlSystem(),
            new CameraMatrixSyncSystem(),

            // Physics
            new KinematicsSystem(),
            new TransformMatrixSyncSystem(),

            // Graphics
            new GraphicsInitSystem(),
            new MeshRenderSystem(),

            // Game
            new GameInitSystem(),
        ];

        for (const system of this.systems)
            system.start(this);
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

    addEntity(configId: string): Entity
    {
        const entity = this.entityPool.rent();
        const entityConfig = globalConfig.entityConfigById[configId];
        for (const [componentType, componentValues] of Object.entries(entityConfig))
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

    addComponent(entityId: number, componentType: string, componentValues: {[key: string]: [type: string, value: any]})
    {
        const entity = this.entityPool.get(entityId);
        const component = ComponentPools[componentType].rent();
        component.entityId = entityId;

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