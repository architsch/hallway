import * as THREE from "three";
import { GlobalFunctions } from "../GlobalFunctions";

export default class SceneManager
{
    private mainScene: THREE.Scene;

    constructor()
    {
        this.mainScene = new THREE.Scene();

        GlobalFunctions.register("SceneManager::addObject3D", (obj: THREE.Object3D) => {
            this.mainScene.add(obj);
        });
        GlobalFunctions.register("SceneManager::removeObject3D", (obj: THREE.Object3D) => {
            this.mainScene.remove(obj);
        });
    }

    getMainScene(): THREE.Scene
    {
        return this.mainScene;
    }
}