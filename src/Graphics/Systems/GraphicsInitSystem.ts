import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { GraphicsComponent } from "../Models/GraphicsComponents";

export default class GraphicsInitSystem extends System
{
    private gameScreen: HTMLElement;
    private gameCanvas: HTMLCanvasElement;
    private canvasWidth: number = 800;
    private canvasHeight: number = 400;
    private canvasAspectRatio: number = this.canvasWidth / this.canvasHeight;

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [];
    }

    start(ecs: ECSManager)
    {
        this.gameScreen = document.getElementById("gameScreen") as HTMLElement;
        this.gameScreen.style.position = "fixed";
        this.gameScreen.style.display = "block";
        this.gameScreen.style.margin = "0 0 0 0";
        this.gameScreen.style.padding = "0 0 0 0";
        this.gameScreen.style.width = "100%";
        this.gameScreen.style.height = "100%";
        this.gameScreen.style.left = "0";
        this.gameScreen.style.right = "0";
        this.gameScreen.style.top = "0";
        this.gameScreen.style.bottom = "0";
        this.gameScreen.style.backgroundColor = "#606040";

        this.gameCanvas = document.createElement("canvas") as HTMLCanvasElement;
        this.gameScreen.appendChild(this.gameCanvas);

        this.gameCanvas.width = this.canvasWidth;
        this.gameCanvas.height = this.canvasHeight;
        this.gameCanvas.style.position = "absolute";
        this.gameCanvas.style.display = "block";
        this.gameCanvas.style.margin = "auto";
        this.gameCanvas.style.padding = "0 0 0 0"
        this.gameCanvas.style.left = "0";
        this.gameCanvas.style.right = "0";
        this.gameCanvas.style.top = "0";
        this.gameCanvas.style.bottom = "0";
        this.gameCanvas.style.imageRendering = "pixelated";
        this.gameCanvas.style.backgroundColor = "#a0a0e0";
        this.gameCanvas.style.border = "1px solid magenta";

        this.adjustCanvasToScreenSize = this.adjustCanvasToScreenSize.bind(this);
        window.addEventListener("resize", this.adjustCanvasToScreenSize);

        this.adjustCanvasToScreenSize();

        const gl = this.gameCanvas.getContext("webgl2");
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.viewport(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        const entity = ecs.addEntity("empty");
        const component = ecs.addComponent(entity.id, "Graphics") as GraphicsComponent;
        component.gl = gl;
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private adjustCanvasToScreenSize()
    {
        const screenWidth = this.gameScreen.clientWidth;
        const screenHeight = this.gameScreen.clientHeight;

        if (screenWidth < 1 || screenHeight < 1)
        {
            console.error("The screen either has no width or height.");
            return;
        }
        
        let canvasStyleWidth = 0;
        let canvasStyleHeight = 0;
        const screenAspectRatio = screenWidth / screenHeight;

        if (this.canvasAspectRatio > screenAspectRatio) // gameCanvas is more horizontally stretched than the screen.
        {
            // In this case, we must fit gameCanvas's width to the screen's width.
            canvasStyleWidth = screenWidth;
            canvasStyleHeight = Math.round(canvasStyleWidth / this.canvasAspectRatio);
        }
        else // The screen is more horizontally stretched than gameCanvas.
        {
            // In this case, we must fit gameCanvas's height to the screen's height.
            canvasStyleHeight = screenHeight;
            canvasStyleWidth = Math.round(canvasStyleHeight * this.canvasAspectRatio);
        }

        this.gameCanvas.style.width = `${canvasStyleWidth - 2}px`; // -2 is for compensating for the 1px borders of gameCanvas.
        this.gameCanvas.style.height = `${canvasStyleHeight - 2}px`;
    }
}