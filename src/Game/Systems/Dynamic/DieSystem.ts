import ECSManager from "../../../ECS/ECSManager";
import Entity from "../../../ECS/Entity";
import System from "../../../ECS/System";
import { Component } from "../../../ECS/Component";
import { CollisionEventComponent } from "../../../Physics/Models/PhysicsComponents";
import { DieAfterDelayComponent, DieOnCollisionComponent } from "../../Models/DynamicComponents";

export default class DieSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEvent", ["CollisionEvent"]],
            ["DieAfterDelay", ["DieAfterDelay"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        let entities = this.queryEntityGroup("CollisionEvent");

        entities.forEach((entity: Entity) => {
            const event = ecs.getComponent(entity.id, "CollisionEvent") as CollisionEventComponent;
            this.onCollision(ecs, event.entityId1, event.entityId2);
            this.onCollision(ecs, event.entityId2, event.entityId1);
        });

        entities = this.queryEntityGroup("DieAfterDelay");

        entities.forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "DieAfterDelay") as DieAfterDelayComponent;
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

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }

    private onCollision(ecs: ECSManager, myEntityId: number, otherEntityId: number)
    {
        if (ecs.hasComponent(myEntityId, "DieOnCollision"))
        {
            const c = ecs.getComponent(myEntityId, "DieOnCollision") as DieOnCollisionComponent;
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