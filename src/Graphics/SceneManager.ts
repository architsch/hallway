import * as THREE from "three";

export default class SceneManager
{
    private mainScene: THREE.Scene;

    constructor()
    {
        this.mainScene = new THREE.Scene();
    }

    getMainScene(): THREE.Scene
    {
        return this.mainScene;
    }
}