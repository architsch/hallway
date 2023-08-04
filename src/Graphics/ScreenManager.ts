export default class ScreenManager
{
    private gameScreen: HTMLElement;
    private gameCanvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private canvasAspectRatio: number;

    constructor()
    {
        this.gameScreen = document.getElementById("gameScreen") as HTMLElement;
        this.gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        this.canvasWidth = this.gameCanvas.width;
        this.canvasHeight = this.gameCanvas.height;
        this.canvasAspectRatio = this.canvasWidth / this.canvasHeight;

        this.adjustCanvasToScreenSize = this.adjustCanvasToScreenSize.bind(this);
        window.addEventListener("resize", this.adjustCanvasToScreenSize);

        this.adjustCanvasToScreenSize();
    }

    adjustCanvasToScreenSize()
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