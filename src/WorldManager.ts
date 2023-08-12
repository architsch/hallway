import ECSManager from "./ECS/ECSManager";
import GraphicsManager from "./Graphics/GraphicsManager";
import InputManager from "./Input/InputManager";
import PhysicsManager from "./Physics/PhysicsManager";

export default class WorldManager
{
    private ecsManager: ECSManager;
    private inputManager: InputManager;
    private physicsManager: PhysicsManager;
    private graphicsManager: GraphicsManager;

    constructor()
    {
        this.ecsManager = new ECSManager();
        this.inputManager = new InputManager();
        this.physicsManager = new PhysicsManager();
        this.graphicsManager = new GraphicsManager();

        this.ecsManager.addEntity("Default");
        this.ecsManager.addEntity("Default");
        this.ecsManager.addEntity("Default");
        this.ecsManager.addEntity("Default");
        this.ecsManager.addEntity("Default");
        this.ecsManager.addEntity("Default");
        this.ecsManager.addEntity("Default");
        this.ecsManager.addEntity("Default");
    }

    update(t: number, dt: number)
    {
        this.ecsManager.update(t, dt);
        this.physicsManager.update(t, dt);
        this.graphicsManager.update(t, dt);
    }
}