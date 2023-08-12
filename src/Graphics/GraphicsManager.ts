import * as THREE from "three";
import CameraManager from "./CameraManager";
import ScreenManager from "./ScreenManager";
import SceneManager from "./SceneManager";
import LightManager from "./LightManager";
import MeshManager from "./Asset/MeshManager";

export default class GraphicsManager
{
    private screenManager: ScreenManager;
    private cameraManager: CameraManager;
    private sceneManager: SceneManager;
    private lightManager: LightManager;
    private meshManager: MeshManager;

    private renderer: THREE.WebGLRenderer;

    constructor()
    {
        this.screenManager = new ScreenManager();
        this.cameraManager = new CameraManager(this.screenManager.canvasAspectRatio);
        this.sceneManager = new SceneManager();
        this.lightManager = new LightManager(this.sceneManager.getMainScene());
        this.meshManager = new MeshManager(this.sceneManager.getMainScene());

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.screenManager.gameCanvas,
            powerPreference: "high-performance",
            antialias: false,
        });
    }

    update(t: number, dt: number)
    {
        this.cameraManager.update(t, dt);
        
        this.renderer.render(this.sceneManager.getMainScene(), this.cameraManager.getMainCamera());
    }
}