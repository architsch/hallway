import ECSManager from "../../ECS/ECSManager";
import System from "../../ECS/System";
import Entity from "../../ECS/Entity";
import { MeshInstanceComponent, TransformComponent } from "../../ECS/Components";
import { SystemGateway } from "../../ECS/SystemGateway";
import Mesh from "./Mesh";
import ShaderManager from "./ShaderManager";
import TextureManager from "./TextureManager";
import { GLBufferAttribParams } from "./GLBufferAttrib";

export default class MeshManager
{
    private gl: WebGL2RenderingContext;
    private shaderManager: ShaderManager;
    private textureManager: TextureManager;

    private meshById: {[id: string]: Mesh};
    private freeInstanceIndicesById: {[id: string]: Array<number>};

    private floatArray10: Float32Array;

    constructor(gl: WebGL2RenderingContext)
    {
        this.gl = gl;
        this.shaderManager = new ShaderManager(gl);
        this.textureManager = new TextureManager(gl);

        this.meshById = {};
        this.freeInstanceIndicesById = {};

        this.floatArray10 = new Float32Array(10);

        //------------------------------------------------------------------------------
        // Transform-mesh sync system
        //------------------------------------------------------------------------------

        const system = new System();
        system.requiredComponentTypes.add("Transform");
        system.requiredComponentTypes.add("MeshInstance");

        system.update = (ecs: ECSManager, t: number, dt: number) => {
            system.entities.forEach((entity: Entity) => {
                const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
                if (!transformComponent.syncedWithMesh)
                {
                    const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
                    const mesh = this.meshById[meshInstanceComponent.meshId];

                    const positionIndex = mesh.getInstanceAttribIndex("modelTranslation");
                    const modelScaleAndAngleIndex = mesh.getInstanceAttribIndex("modelScaleAndAngle");
                    this.floatArray10[positionIndex] = transformComponent.position[0];
                    this.floatArray10[positionIndex+1] = transformComponent.position[1];
                    this.floatArray10[positionIndex+2] = transformComponent.position[2];
                    this.floatArray10[modelScaleAndAngleIndex] = transformComponent.scale[0];
                    this.floatArray10[modelScaleAndAngleIndex+1] = transformComponent.scale[1];
                    this.floatArray10[modelScaleAndAngleIndex+2] = transformComponent.angleZ;

                    mesh.setInstanceDataAt(meshInstanceComponent.instanceIndex, this.floatArray10);
                    transformComponent.syncedWithMesh = true;
                }
            });
        };

        system.onEntityRegistered = (ecs: ECSManager, entity: Entity) => {
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
            
            const meshId = meshInstanceComponent.meshId;
            const mesh = this.meshById[meshId];
            if (mesh == undefined)
                throw new Error(`Mesh not found :: meshId: ${meshId}`);
            meshInstanceComponent.instanceIndex = this.freeInstanceIndicesById[meshId].pop();
            transformComponent.syncedWithMesh = true;

            const uvScaleIndex = mesh.getInstanceAttribIndex("uvScale");
            const uvShiftIndex = mesh.getInstanceAttribIndex("uvShift");
            this.floatArray10[uvScaleIndex] = meshInstanceComponent.uvScale[0];
            this.floatArray10[uvScaleIndex+1] = meshInstanceComponent.uvScale[1];
            this.floatArray10[uvShiftIndex] = meshInstanceComponent.uvShift[0];
            this.floatArray10[uvShiftIndex+1] = meshInstanceComponent.uvShift[1];

            mesh.setInstanceDataAt(meshInstanceComponent.instanceIndex, this.floatArray10);
        };

        system.onEntityUnregistered = (ecs: ECSManager, entity: Entity) => {
            const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;

            const mesh = this.meshById[meshInstanceComponent.meshId];

            const positionIndex = mesh.getInstanceAttribIndex("modelTranslation");
            this.floatArray10[positionIndex] = -999;
            this.floatArray10[positionIndex+1] = -999;
            this.floatArray10[positionIndex+2] = -999;

            mesh.setInstanceDataAt(meshInstanceComponent.instanceIndex, this.floatArray10);

            this.freeInstanceIndicesById[meshInstanceComponent.meshId].push(meshInstanceComponent.instanceIndex);
        };

        SystemGateway.push(system);
    }

    async init()
    {
        await this.textureManager.init();

        const vertexBufferData = new Float32Array([
            -0.5, -0.5, 0.0, 0.0, 0.0,
            -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.0, 1.0, 1.0,
            0.5, -0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, 0.0, 0.0, 1.0,
        ]);
        const instanceBufferData = new Float32Array(10 * 256);
        let n = 0;
        for (let i = 0; i < 256; ++i)
        {
            // uvScale
            instanceBufferData[n++] = 0.0625;
            instanceBufferData[n++] = 0.0625;
            // uvShift
            instanceBufferData[n++] = 0;
            instanceBufferData[n++] = 0;
            // modelTranslation
            instanceBufferData[n++] = -999;
            instanceBufferData[n++] = -999;
            instanceBufferData[n++] = -999;
            // modelScaleAndAngle
            instanceBufferData[n++] = 1;
            instanceBufferData[n++] = 1;
            instanceBufferData[n++] = 0;
        }

        this.registerMesh("default", "default", "default",
            6, [
                {name: "position", numFloats: 3},
                {name: "uv", numFloats: 2}
            ],
            vertexBufferData,
            256, [
                {name: "uvScale", numFloats: 2},
                {name: "uvShift", numFloats: 2},
                {name: "modelTranslation", numFloats: 3},
                {name: "modelScaleAndAngle", numFloats: 3}
            ],
            instanceBufferData);
    }

    getMeshById(): {[id: string]: Mesh}
    {
        return this.meshById;
    }

    private registerMesh(meshId: string, shaderId: string, textureId: string,
        numVertices: number, vertexAttribs: Array<GLBufferAttribParams>, vertexBufferData: Float32Array,
        numInstances: number, instanceAttribs: Array<GLBufferAttribParams>, instanceBufferData: Float32Array)
    {
        if (this.meshById[meshId] != undefined)
            throw new Error(`Mesh "${meshId}" is already registered.`);
        if (this.freeInstanceIndicesById[meshId] != undefined)
            throw new Error(`Mesh "${meshId}" already has an array of free instance indices.`);

        const shader = this.shaderManager.getShader(shaderId);
        const texture = this.textureManager.getTexture(textureId);

        const mesh = new Mesh(this.gl, shader, texture, numVertices, vertexAttribs, numInstances, instanceAttribs);
        mesh.setVertexData(vertexBufferData);
        mesh.setInstanceData(instanceBufferData);
        this.meshById[meshId] = mesh;

        const freeIndices = new Array<number>(numInstances);
        this.freeInstanceIndicesById[meshId] = freeIndices;

        mesh.clearInstanceData(-999);
    }
}