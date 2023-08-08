import CollisionManager from "./CollisionManager";

export default class PhysicsManager
{
    private collisionManager: CollisionManager;

    constructor()
    {
        this.collisionManager = new CollisionManager();
    }

    update(t: number, dt: number)
    {
        this.collisionManager.update(t, dt);
    }
}