import * as THREE from "three";
import GlobalObservables from "../Util/Observable/GlobalObservables";
import ObservableSet from "../Util/Observable/ObservableSet";

export default class CameraManager
{
    private mainCamera: THREE.PerspectiveCamera;
    private mainCameraSpeed: number = 3;
    private left: boolean = false;
    private right: boolean = false;
    private down: boolean = false;
    private up: boolean = false;

    constructor(aspectRatio: number)
    {
        this.mainCamera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100);
        this.mainCamera.position.set(0, 0, 10);

        const pressedKeys = GlobalObservables.get("pressedKeys") as ObservableSet<string>;
        pressedKeys.subscribe_add("cameraControl", (key: string) => {
            switch (key)
            {
                case "ArrowLeft": this.left = true; break;
                case "ArrowRight": this.right = true; break;
                case "ArrowDown": this.down = true; break;
                case "ArrowUp": this.up = true; break;
            }
        });
        pressedKeys.subscribe_delete("cameraControl", (key: string) => {
            switch (key)
            {
                case "ArrowLeft": this.left = false; break;
                case "ArrowRight": this.right = false; break;
                case "ArrowDown": this.down = false; break;
                case "ArrowUp": this.up = false; break;
            }
        });
        pressedKeys.subscribe_clear("cameraControl", () => {
            this.left = false;
            this.right = false;
            this.down = false;
            this.up = false;
        });
    }

    update(t: number, dt: number)
    {
        const v = this.mainCamera.position;
        let xControl = 0;
        let zControl = 0;

        if (this.left && !this.right)
            xControl = -1;
        else if (!this.left && this.right)
            xControl = 1;

        if (this.up && !this.down)
            zControl = -1;
        else if (!this.up && this.down)
            zControl = 1;

        v.setX(v.x + xControl * this.mainCameraSpeed * dt);
        v.setZ(v.z + zControl * this.mainCameraSpeed * dt);
    }

    getMainCamera(): THREE.Camera
    {
        return this.mainCamera;
    }
}