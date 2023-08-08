import * as THREE from "three";
import TextureManager from "./TextureManager";

export default class MaterialManager
{
    private materialById: {[id: string]: THREE.Material};
    
    constructor(textureManager: TextureManager)
    {
        this.materialById = {};
        this.materialById["red"] = new THREE.MeshPhongMaterial({color: new THREE.Color(0xff0000)});
        this.materialById["green"] = new THREE.MeshPhongMaterial({color: new THREE.Color(0x00ff00)});
        this.materialById["blue"] = new THREE.MeshPhongMaterial({color: new THREE.Color(0x0000ff)});
    }

    getMaterial(id: string): THREE.Material
    {
        return this.materialById[id];
    }
}