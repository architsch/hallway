import * as THREE from "three";

export default class GeometryManager
{
    private geometryById: {[id: string]: THREE.BufferGeometry};

    constructor()
    {
        this.geometryById = {};
        this.geometryById["box"] = new THREE.BoxGeometry(1, 1, 1);
    }

    getGeometry(id: string): THREE.BufferGeometry
    {
        return this.geometryById[id];
    }
}