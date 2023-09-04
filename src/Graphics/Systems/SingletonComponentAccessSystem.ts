import { Component } from "../../ECS/Component";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";

export default class SingletonComponentAccessSystem extends System
{
    private singletonComponents: {[componentType: string]: Component | null};

    get(componentType: string): Component | null
    {
        return this.singletonComponents[componentType];
    }

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Graphics", ["Graphics"]],
            ["Camera", ["Camera"]],
            ["Light", ["Light"]],
        ];
    }

    constructor()
    {
        super();
        this.singletonComponents = {};

        const groups = this.getCriteria();
        for (const [groupId, requiredComponentTypes] of groups)
        {
            for (const requiredComponentType of requiredComponentTypes)
            {
                if (this.singletonComponents[requiredComponentType] === undefined)
                    this.singletonComponents[requiredComponentType] = null;
            }
        }
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
        for (const [componentType, component] of Object.entries(this.singletonComponents))
        {
            if (entity.componentIds[componentType] != undefined)
            {
                if (component === null)
                {
                    this.singletonComponents[componentType] = ecs.getComponent(entity.id, componentType);
                    console.log(`Singleton component registered :: ${componentType}`);
                }
                else
                    throw new Error(`"${componentType}" is supposed to be a singleton component, but multiple instances are found.`);
            }
        }
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
        for (const [componentType, component] of Object.entries(this.singletonComponents))
        {
            if (entity.componentIds[componentType] != undefined)
            {
                if (component !== null)
                {
                    this.singletonComponents[componentType] = null;
                    console.log(`Singleton component unregistered :: ${componentType}`);
                }
                else
                    throw new Error(`"${componentType}" singleton component is already null.`);
            }
        }
    }
}