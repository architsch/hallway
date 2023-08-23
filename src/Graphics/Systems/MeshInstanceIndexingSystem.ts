import { globalConfig } from "../../Config/GlobalConfig";
import { MeshInstanceComponent } from "../../ECS/Components";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";

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

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
        const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
        let freeInstanceIndices = this.freeInstanceIndicesByMeshConfigId[meshInstanceComponent.meshConfigId];
        if (freeInstanceIndices == undefined)
        {
            const meshConfig = globalConfig.meshConfigById[meshInstanceComponent.meshConfigId];
            freeInstanceIndices = new Array<number>(meshConfig.numInstances);
            for (let i = 0; i < meshConfig.numInstances; ++i)
                freeInstanceIndices[i] = meshConfig.numInstances - 1 - i;
            this.freeInstanceIndicesByMeshConfigId[meshInstanceComponent.meshConfigId] = freeInstanceIndices;
        }
        if (freeInstanceIndices.length == 0)
            throw new Error(`Ran out of free instance indices (entity.id = ${entity.id}, meshConfigId = ${meshInstanceComponent.meshConfigId})`);
        meshInstanceComponent.instanceIndex = freeInstanceIndices.pop();
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
        const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
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