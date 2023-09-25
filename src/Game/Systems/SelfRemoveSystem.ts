import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { Component } from "../../ECS/Component";
import { CollisionEventComponent } from "../../Physics/Models/PhysicsComponents";

export default class SelfRemoveSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEvent", ["CollisionEvent"]],
            ["SelfRemoveOnTimerTick", ["SelfRemoveOnTimerTick", "TimerTickEvent"]],
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
            this.selfRemoveOnCollisionWithRigidbody(ecs, event.entityId1, event.entityId2);
            this.selfRemoveOnCollisionWithRigidbody(ecs, event.entityId2, event.entityId1);
        });

        entities = this.queryEntityGroup("SelfRemoveOnTimerTick");

        entities.forEach((entity: Entity) => {
            ecs.removeEntity(entity.id);
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }

    private selfRemoveOnCollisionWithRigidbody(ecs: ECSManager, myEntityId: number, otherEntityId: number)
    {
        if (ecs.hasComponent(myEntityId, "SelfRemoveOnCollisionWithRigidbody") && ecs.hasComponent(otherEntityId, "Rigidbody"))
            ecs.removeEntity(myEntityId);
    }
}