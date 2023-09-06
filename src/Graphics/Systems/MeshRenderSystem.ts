import { globalConfig } from "../../Config/GlobalConfig";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { ColorComponent, GraphicsComponent, MeshInstanceComponent, SpriteComponent } from "../Models/GraphicsComponents";
import Mesh from "../Models/Mesh";

export default class MeshRenderSystem extends System
{
    private meshInstanceDataTemp: Float32Array = new Float32Array(64);
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

            const mesh = Mesh.get(meshInstanceComponent.meshConfigId, {gl}) as Mesh | null;
            if (mesh != null)
            {
                if (!this.meshesToRender.has(mesh))
                    this.meshesToRender.add(mesh);

                if (!meshInstanceComponent.bufferSynced)
                {
                    if (ecs.hasComponent(entity.id, "Transform"))
                    {
                        const c = ecs.getComponent(entity.id, "Transform") as TransformComponent;

                        let floatOffset = mesh.getInstanceAttribFloatOffset("worldMat");
                        for (let i = 0; i < 16; ++i)
                            this.meshInstanceDataTemp[floatOffset + i] = c.worldMat[i];
                    }

                    if (ecs.hasComponent(entity.id, "Sprite"))
                    {
                        const c = ecs.getComponent(entity.id, "Sprite") as SpriteComponent;

                        let floatOffset = mesh.getInstanceAttribFloatOffset("uvScale");
                        this.meshInstanceDataTemp[floatOffset] = c.uvScale[0];
                        this.meshInstanceDataTemp[floatOffset+1] = c.uvScale[1];

                        floatOffset = mesh.getInstanceAttribFloatOffset("uvShift");
                        this.meshInstanceDataTemp[floatOffset] = c.uvShift[0];
                        this.meshInstanceDataTemp[floatOffset+1] = c.uvShift[1];
                    }

                    if (ecs.hasComponent(entity.id, "Color"))
                    {
                        const c = ecs.getComponent(entity.id, "Color") as ColorComponent;

                        let floatOffset = mesh.getInstanceAttribFloatOffset("color");
                        this.meshInstanceDataTemp[floatOffset] = c.color[0];
                        this.meshInstanceDataTemp[floatOffset+1] = c.color[1];
                        this.meshInstanceDataTemp[floatOffset+2] = c.color[2];
                    }

                    mesh.updateInstanceData(meshInstanceComponent.instanceIndex, this.meshInstanceDataTemp);
                    meshInstanceComponent.bufferSynced = true;
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