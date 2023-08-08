import * as THREE from "three";
import MaterialManager from "./MaterialManager";
import GeometryManager from "./GeometryManager";

export default class MeshManager
{
    private meshById: {[id: string]: THREE.Mesh};

    constructor(materialManager: MaterialManager, geometryManager: GeometryManager)
    {
        this.meshById = {};
        this.meshById["box_red"] = new THREE.Mesh(
            geometryManager.getGeometry("box"), materialManager.getMaterial("red"));
        this.meshById["box_green"] = new THREE.Mesh(
            geometryManager.getGeometry("box"), materialManager.getMaterial("green"));
        this.meshById["box_blue"] = new THREE.Mesh(
            geometryManager.getGeometry("box"), materialManager.getMaterial("blue"));
    }

    getMesh(id: string): THREE.Mesh
    {
        return this.meshById[id];
    }
}