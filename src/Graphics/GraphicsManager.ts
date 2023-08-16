import CameraManager from "./Camera/CameraManager";
import ScreenManager from "./ScreenManager";
import MeshManager from "./Mesh/MeshManager";
import GLRenderer from "./GLRenderer";

export default class GraphicsManager
{
    private screenManager: ScreenManager;
    private cameraManager: CameraManager;
    private meshManager: MeshManager;

    private renderer: GLRenderer;

    constructor()
    {
        this.screenManager = new ScreenManager();

        const gl = this.screenManager.gameCanvas.getContext("webgl2");

        this.cameraManager = new CameraManager(this.screenManager.canvasAspectRatio);
        this.meshManager = new MeshManager(gl);

        this.renderer = new GLRenderer(gl);
    }

    async init()
    {
        await this.meshManager.init();
    }

    update(t: number, dt: number)
    {
        this.cameraManager.update(t, dt);
        
        this.renderer.render(this.meshManager.getMeshById(), this.cameraManager.getMainCamera());
    }
}