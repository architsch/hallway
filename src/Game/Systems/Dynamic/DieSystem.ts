import ECSManager from "../../../ECS/ECSManager";
import Entity from "../../../ECS/Entity";
import System from "../../../ECS/System";
import { CollisionEventComponent } from "../../../Physics/Models/PhysicsComponents";
import { DieAfterDelayComponent, DieOnCollisionComponent } from "../../Models/DynamicComponents";

export default class DieSystem extends System
{
    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEventComponent", ["CollisionEventComponent"]],
            ["DieAfterDelayComponent", ["DieAfterDelayComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        let entities = this.queryEntityGroup("CollisionEventComponent");

        entities.forEach((entity: Entity) => {
            const event = ecs.getComponent(entity.id, "CollisionEventComponent") as CollisionEventComponent;
            this.onCollision(ecs, event.entityId1, event.entityId2);
            this.onCollision(ecs, event.entityId2, event.entityId1);
        });

        entities = this.queryEntityGroup("DieAfterDelayComponent");

        entities.forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "DieAfterDelayComponent") as DieAfterDelayComponent;
            if (c.startTime == undefined)
            {
                c.startTime = t;
            }
            if (t > c.startTime + c.delay)
            {
                this.action(ecs, entity.id);
            }
        });
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private onCollision(ecs: ECSManager, myEntityId: number, otherEntityId: number)
    {
        if (ecs.hasComponent(myEntityId, "DieOnCollisionComponent"))
        {
            const c = ecs.getComponent(myEntityId, "DieOnCollisionComponent") as DieOnCollisionComponent;
            if ((c.myEntityComponentTypeRequired == undefined || ecs.hasComponent(myEntityId, c.myEntityComponentTypeRequired)) &&
                (c.otherEntityComponentTypeRequired == undefined || ecs.hasComponent(otherEntityId, c.otherEntityComponentTypeRequired)))
            {
                this.action(ecs, myEntityId);
            }
        }
    }

    private action(ecs: ECSManager, entityId: number)
    {
        ecs.removeEntity(entityId);
    }
}