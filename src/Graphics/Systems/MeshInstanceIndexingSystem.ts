import { globalConfig } from "../../Config/GlobalConfig";
import { Component } from "../../ECS/Component";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { MeshInstanceComponent } from "../Models/GraphicsComponents";

export default class MeshInstanceIndexingSystem extends System
{
    private freeInstanceIndicesByMeshConfigId: {[meshConfigId: string]: Array<number>};

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["MeshInstance", ["MeshInstance"]],
        ];
    }

    start(ecs: ECSManager)
    {
        this.freeInstanceIndicesByMeshConfigId = {};
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
        const meshInstanceComponent = componentAdded as MeshInstanceComponent;
        let freeInstanceIndices = this.freeInstanceIndicesByMeshConfigId[meshInstanceComponent.meshConfigId];
        if (freeInstanceIndices == undefined)
        {
            const meshConfig = globalConfig.meshConfigById[meshInstanceComponent.meshConfigId];
            if (meshConfig == undefined)
                throw new Error(`Mesh config not found (id = ${meshInstanceComponent.meshConfigId})`);

            const geometryConfig = globalConfig.geometryConfigById[meshConfig.geometryConfigId];
            if (geometryConfig == undefined)
                throw new Error(`Geometry config not found (id = ${meshConfig.geometryConfigId})`);

            freeInstanceIndices = new Array<number>(geometryConfig.numInstances);
            for (let i = 0; i < geometryConfig.numInstances; ++i)
                freeInstanceIndices[i] = geometryConfig.numInstances - 1 - i;
            this.freeInstanceIndicesByMeshConfigId[meshInstanceComponent.meshConfigId] = freeInstanceIndices;
        }
        if (freeInstanceIndices.length == 0)
            throw new Error(`Ran out of free instance indices (entity.id = ${entity.id}, meshConfigId = ${meshInstanceComponent.meshConfigId})`);
        meshInstanceComponent.instanceIndex = freeInstanceIndices.pop();
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
        const meshInstanceComponent = componentRemoved as MeshInstanceComponent;
        let freeInstanceIndices = this.freeInstanceIndicesByMeshConfigId[meshInstanceComponent.meshConfigId];
        if (freeInstanceIndices != undefined)
        {
            freeInstanceIndices.push(meshInstanceComponent.instanceIndex);
            meshInstanceComponent.instanceIndex = -1;
        }
        else
            throw new Error(`List of free instance indices doesn't exist for meshConfigId: "${meshInstanceComponent.meshConfigId}"`);
    }
}