import * as THREE from "three";
import MaterialManager from "./MaterialManager";
import GeometryManager from "./GeometryManager";
import ECSManager from "../../ECS/ECSManager";
import System from "../../ECS/System";
import Entity from "../../ECS/Entity";
import { MeshInstanceComponent, TransformComponent } from "../../ECS/Components";
import { SystemGateway } from "../../ECS/SystemGateway";

export default class MeshManager
{
    private geometryManager: GeometryManager;
    private materialManager: MaterialManager;

    private meshById: {[id: string]: THREE.InstancedMesh};
    private freeInstanceIndicesById: {[id: string]: Array<number>};
    private dummyObj: THREE.Object3D;

    constructor(scene: THREE.Scene)
    {
        this.geometryManager = new GeometryManager();
        this.materialManager = new MaterialManager();

        this.meshById = {};
        this.freeInstanceIndicesById = {};
        this.dummyObj = new THREE.Object3D();

        const numInstances = 256;

        this.registerMesh("box_red", scene, "box", "red", numInstances);
        this.registerMesh("box_green", scene, "box", "green", numInstances);
        this.registerMesh("box_blue", scene, "box", "blue", numInstances);

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
                    this.dummyObj.position.set(transformComponent.x, transformComponent.y, transformComponent.z);
                    this.dummyObj.rotation.set(transformComponent.rotX, transformComponent.rotY, transformComponent.rotZ);
                    this.dummyObj.scale.set(transformComponent.scaleX, transformComponent.scaleY, transformComponent.scaleZ);
                    this.dummyObj.updateMatrix();
                    mesh.setMatrixAt(meshInstanceComponent.instanceIndex, this.dummyObj.matrix);

                    transformComponent.syncedWithMesh = true;
                }
            });
        };

        system.onEntityRegistered = (ecs: ECSManager, entity: Entity) => {
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;
            meshInstanceComponent.instanceIndex = this.freeInstanceIndicesById[meshInstanceComponent.meshId].pop();
            transformComponent.syncedWithMesh = true;
        };

        system.onEntityUnregistered = (ecs: ECSManager, entity: Entity) => {
            const meshInstanceComponent = ecs.getComponent(entity.id, "MeshInstance") as MeshInstanceComponent;

            this.dummyObj.position.set(-999, -999, -999);
            this.dummyObj.updateMatrix();
            this.meshById[meshInstanceComponent.meshId].setMatrixAt(meshInstanceComponent.instanceIndex, this.dummyObj.matrix);
            this.freeInstanceIndicesById[meshInstanceComponent.meshId].push(meshInstanceComponent.instanceIndex);
        };

        SystemGateway.push(system);
    }

    private registerMesh(meshId: string, scene: THREE.Scene, geometryId: string, materialId: string, numInstances: number)
    {
        if (this.meshById[meshId] != undefined)
            throw new Error(`Mesh "${meshId}" is already registered.`);
        if (this.freeInstanceIndicesById[meshId] != undefined)
            throw new Error(`Mesh "${meshId}" already has an array of free instance indices.`);

        const mesh = new THREE.InstancedMesh(this.geometryManager.getGeometry(geometryId), this.materialManager.getMaterial(materialId), numInstances);
        this.meshById[meshId] = mesh;
        scene.add(mesh);

        const freeIndices = new Array<number>(numInstances);
        this.freeInstanceIndicesById[meshId] = freeIndices;
        for (let i = 0; i < numInstances; ++i)
        {
            const instanceIndex = numInstances-1 - i;
            freeIndices[i] = instanceIndex;
            this.dummyObj.position.set(-999, -999, -999);
            this.dummyObj.updateMatrix();
            mesh.setMatrixAt(instanceIndex, this.dummyObj.matrix);
        }
    }
}