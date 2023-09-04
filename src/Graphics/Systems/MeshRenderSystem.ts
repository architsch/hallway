import { globalConfig } from "../../Config/GlobalConfig";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformComponent } from "../../Physics/Models/Components";
import { GraphicsComponent, MeshInstanceComponent } from "../Models/Components";
import Mesh from "../Models/Mesh";

export default class MeshRenderSystem extends System
{
    private meshInstanceDataTemp: Float32Array = new Float32Array(23);
    private meshesToRender: Set<Mesh> = new Set<Mesh>();

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["MeshInstance", ["MeshInstance", "Transform"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const graphicsComponent = ecs.singletonComponents().get("Graphics") as GraphicsComponent;
        const gl = graphicsComponent.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        this.meshesToRender.clear();
        const meshInstanceEntities = this.entityGroups["MeshInstance"];

        meshInstanceEntities.forEach((entity: Entity) => {
            const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;

            const mesh = Mesh.get(meshInstanceComponent.meshConfigId, {gl});
            if (mesh != null)
            {
                if (!this.meshesToRender.has(mesh))
                    this.meshesToRender.add(mesh);

                if (!transformComponent.meshInstanceSynced)
                {
                    for (let i = 0; i < 16; ++i)
                        this.meshInstanceDataTemp[i] = transformComponent.worldMat[i];
                    this.meshInstanceDataTemp[16] = meshInstanceComponent.uvScale[0];
                    this.meshInstanceDataTemp[17] = meshInstanceComponent.uvScale[1];
                    this.meshInstanceDataTemp[18] = meshInstanceComponent.uvShift[0];
                    this.meshInstanceDataTemp[19] = meshInstanceComponent.uvShift[1];
                    this.meshInstanceDataTemp[20] = meshInstanceComponent.color[0];
                    this.meshInstanceDataTemp[21] = meshInstanceComponent.color[1];
                    this.meshInstanceDataTemp[22] = meshInstanceComponent.color[2];
                    mesh.updateInstanceData(meshInstanceComponent.instanceIndex, this.meshInstanceDataTemp);
                    transformComponent.meshInstanceSynced = true;
                }
            }
        });

        this.meshesToRender.forEach((mesh: Mesh) => {
            mesh.use();

            const uniforms = mesh.getUniforms();
            for (const uniformConfigId of Object.keys(uniforms))
            {
                const uniformConfig = globalConfig.uniformConfigById[uniformConfigId];
                const uniformValue = uniformConfig.getCurrentValue(ecs);
                mesh.updateUniform(uniformConfigId, uniformValue);
                //console.log(`uniform [${uniformConfigId}] ---> [${uniformValue.toString()}]`);
            }
            gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.getNumVertices(), mesh.getNumInstances());

            mesh.unuse();
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}