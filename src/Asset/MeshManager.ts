import * as THREE from "three";
import MaterialManager from "./MaterialManager";
import GeometryManager from "./GeometryManager";
import { GlobalFunctions } from "../GlobalFunctions";

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
        
        GlobalFunctions.register("MeshManager::getMesh", (id: string) => {
            return this.meshById[id];
        });
    }
}