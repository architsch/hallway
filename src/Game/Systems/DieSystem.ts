import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent } from "../../Physics/Models/PhysicsComponents";
import { DieAfterDelayComponent } from "../Models/DynamicComponents";

export default class DieSystem extends System
{
    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEventComponent", ["CollisionEventComponent", "DieOnCollisionWithRigidbodyComponent"]],
            ["DieAfterDelayComponent", ["DieAfterDelayComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        this.queryEntityGroup("CollisionEventComponent").forEach((entity: Entity) => {
            const event = ecs.getComponent(entity.id, "CollisionEventComponent") as CollisionEventComponent;
            for (const pair of event.collisionPairs)
            {
                if (ecs.hasComponent(pair.collidingEntityId, "RigidbodyComponent"))
                    this.die(ecs, entity.id);
            }
        });

        this.queryEntityGroup("DieAfterDelayComponent").forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "DieAfterDelayComponent") as DieAfterDelayComponent;
            if (c.startTime == undefined)
            {
                c.startTime = t;
            }
            if (t > c.startTime + c.delay)
            {
                this.die(ecs, entity.id);
            }
        });
    }

    private die(ecs: ECSManager, entityId: number)
    {
        ecs.removeEntity(entityId);
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}