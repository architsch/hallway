import AssetManager from "./Asset/AssetManager";
import GraphicsManager from "./Graphics/GraphicsManager";
import InputManager from "./Input/InputManager";
import PhysicsManager from "./Physics/PhysicsManager";
import Random from "./Util/Math/Random";

export default class WorldManager
{
    private inputManager: InputManager;
    private assetManager: AssetManager;
    private physicsManager: PhysicsManager;
    private graphicsManager: GraphicsManager;

    constructor()
    {
        this.inputManager = new InputManager();
        this.assetManager = new AssetManager();
        this.physicsManager = new PhysicsManager();
        this.graphicsManager = new GraphicsManager();

        this.addEntity("box_red", -2, 0, 0, Random.getRandomRadian(), Random.getRandomRadian(), Random.getRandomRadian());
        this.addEntity("box_green", 0, 0, 0, Random.getRandomRadian(), Random.getRandomRadian(), Random.getRandomRadian());
        this.addEntity("box_blue", 2, 0, 0, Random.getRandomRadian(), Random.getRandomRadian(), Random.getRandomRadian());
    }

    update(t: number, dt: number)
    {
        this.physicsManager.update(t, dt);
        this.graphicsManager.update(t, dt);
    }

    addEntity(meshId: string, x: number, y: number, z: number, eulerX: number, eulerY: number, eulerZ: number)
    {
        const mesh = this.assetManager.getMesh(meshId);
        const meshClone = mesh.clone();
        meshClone.position.set(x, y, z);
        meshClone.rotation.set(eulerX, eulerY, eulerZ);
        this.graphicsManager.addObject(meshClone);
    }
}