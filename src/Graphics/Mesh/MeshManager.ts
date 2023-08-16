import MaterialManager from "../Material/MaterialManager";
import GeometryManager from "../Geometry/GeometryManager";
import ECSManager from "../../ECS/ECSManager";
import System from "../../ECS/System";
import Entity from "../../ECS/Entity";
import { MeshInstanceComponent, TransformComponent } from "../../ECS/Components";
import { SystemGateway } from "../../ECS/SystemGateway";
import GLMesh from "./GLMesh";

export default class MeshManager
{
    private gl: WebGL2RenderingContext;
    private geometryManager: GeometryManager;
    private materialManager: MaterialManager;

    private meshById: {[id: string]: GLMesh};
    private freeInstanceIndicesById: {[id: string]: Array<number>};

    private arrayBuffer10Temp: Float32Array;

    constructor(gl: WebGL2RenderingContext)
    {
        this.gl = gl;
        this.geometryManager = new GeometryManager(gl);
        this.materialManager = new MaterialManager(gl);

        this.meshById = {};
        this.freeInstanceIndicesById = {};

        this.arrayBuffer10Temp = new Float32Array(16);

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
                    this.arrayBuffer10Temp[4] = transformComponent.position[0];
                    this.arrayBuffer10Temp[5] = transformComponent.position[1];
                    this.arrayBuffer10Temp[6] = transformComponent.position[2];
                    this.arrayBuffer10Temp[7] = transformComponent.scale[0];
                    this.arrayBuffer10Temp[8] = transformComponent.scale[1];
                    this.arrayBuffer10Temp[9] = transformComponent.angleZ;
                    mesh.setInstanceDataAt(meshInstanceComponent.instanceIndex, this.arrayBuffer10Temp);
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

            this.arrayBuffer10Temp[0] = meshInstanceComponent.uvScale[0];
            this.arrayBuffer10Temp[1] = meshInstanceComponent.uvScale[1];
            this.arrayBuffer10Temp[2] = meshInstanceComponent.uvShift[0];
            this.arrayBuffer10Temp[3] = meshInstanceComponent.uvShift[1];
            mesh.setInstanceDataAt(meshInstanceComponent.instanceIndex, this.arrayBuffer10Temp);
        };

        system.onEntityUnregistered = (ecs: ECSManager, entity: Entity) => {
            const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;

            const mesh = this.meshById[meshInstanceComponent.meshId];
            this.arrayBuffer10Temp[4] = -999;
            this.arrayBuffer10Temp[5] = -999;
            this.arrayBuffer10Temp[6] = -999;
            mesh.setInstanceDataAt(meshInstanceComponent.instanceIndex, this.arrayBuffer10Temp);

            this.freeInstanceIndicesById[meshInstanceComponent.meshId].push(meshInstanceComponent.instanceIndex);
        };

        SystemGateway.push(system);
    }

    async init()
    {
        await this.materialManager.init();

        this.registerMesh("default", "default", "default");
    }

    getMeshById(): {[id: string]: GLMesh}
    {
        return this.meshById;
    }

    private registerMesh(meshId: string, geometryId: string, materialId: string)
    {
        if (this.meshById[meshId] != undefined)
            throw new Error(`Mesh "${meshId}" is already registered.`);
        if (this.freeInstanceIndicesById[meshId] != undefined)
            throw new Error(`Mesh "${meshId}" already has an array of free instance indices.`);

        const geometry = this.geometryManager.getGeometry(geometryId);
        const material = this.materialManager.getMaterial(materialId);
        const mesh = new GLMesh(geometry, material);
        this.meshById[meshId] = mesh;
        //console.log(`Mesh registered :: meshId: ${meshId}`);

        const numInstances = geometry.getNumInstances();

        const freeIndices = new Array<number>(numInstances);
        this.freeInstanceIndicesById[meshId] = freeIndices;

        mesh.clearInstanceData(-999);
    }
}