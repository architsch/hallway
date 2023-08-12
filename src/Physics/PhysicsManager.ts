import CollisionManager from "./CollisionManager";
import KinematicsManager from "./KinematicsManager";

export default class PhysicsManager
{
    private kinematicsManager: KinematicsManager;
    private collisionManager: CollisionManager;

    constructor()
    {
        this.kinematicsManager = new KinematicsManager();
        this.collisionManager = new CollisionManager();
    }

    update(t: number, dt: number)
    {
        this.kinematicsManager.update(t, dt);
        this.collisionManager.update(t, dt);
    }
}