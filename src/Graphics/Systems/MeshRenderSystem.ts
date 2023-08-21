import { GraphicsComponent, MeshInstanceComponent, TransformComponent } from "../../ECS/Components";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import Mesh from "../Models/Mesh";

export default class MeshRenderSystem extends System
{
    private gl: WebGL2RenderingContext | null = null;

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Graphics", ["Graphics"]],
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

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

        const meshInstanceEntities = this.entityGroups["MeshInstance"];

        meshInstanceEntities.forEach((entity: Entity) => {
            const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;

            const mesh = Mesh.get(meshInstanceComponent.meshConfigId);
            if (mesh == null)
            {
                Mesh.load(this.gl, meshInstanceComponent.meshConfigId);
            }
            else
            {
                // TODO: Set u_cameraViewProj uniform.
                // TODO: Set u_uvScale, u_uvShift uniforms.
                // TODO: Set u_model uniform.
                mesh.use();
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
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}