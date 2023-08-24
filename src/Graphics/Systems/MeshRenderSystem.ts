import { CameraComponent, GraphicsComponent, MeshInstanceComponent, TransformComponent } from "../../ECS/Components";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import Mesh from "../Models/Mesh";

export default class MeshRenderSystem extends System
{
    private gl: WebGL2RenderingContext | null = null;
    private cameraComponent: CameraComponent | null = null;

    private meshInstanceDataTemp: Float32Array = new Float32Array(20);

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Graphics", ["Graphics"]],
            ["Camera", ["Camera"]],
            ["MeshInstance", ["MeshInstance", "Transform"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        if (this.gl == null)
            throw new Error("Rendering context not found.");

        if (this.cameraComponent == null)
            throw new Error("Camera not found.");

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

        const meshInstanceEntities = this.entityGroups["MeshInstance"];

        meshInstanceEntities.forEach((entity: Entity) => {
            const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;

            const mesh = Mesh.get(meshInstanceComponent.meshConfigId, {gl: this.gl});
            if (mesh != null)
            {
                mesh.updateUniform("u_cameraViewProj", this.cameraComponent.viewProjMat);

                for (let i = 0; i < 16; ++i)
                    this.meshInstanceDataTemp[i] = transformComponent.worldMat[i];
                this.meshInstanceDataTemp[16] = meshInstanceComponent.uvScale[0];
                this.meshInstanceDataTemp[17] = meshInstanceComponent.uvScale[1];
                this.meshInstanceDataTemp[18] = meshInstanceComponent.uvShift[0];
                this.meshInstanceDataTemp[19] = meshInstanceComponent.uvShift[1];
                mesh.updateInstanceData(meshInstanceComponent.instanceIndex, this.meshInstanceDataTemp);

                mesh.use();
                
                this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, mesh.getNumVertices(), mesh.getNumInstances());
            }
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
        if (this.gl == null && entity.componentIds["Graphics"] != undefined)
        {
            const graphicsComponent = ecs.getComponent(entity.id, "Graphics") as GraphicsComponent;
            this.gl = graphicsComponent.gl;

            this.gl.clearColor(0.2, 0.4, 0.2, 1.0);
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        }

        if (this.cameraComponent == null && entity.componentIds["Camera"] != undefined)
        {
            this.cameraComponent = ecs.getComponent(entity.id, "Camera") as CameraComponent;
        }
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}