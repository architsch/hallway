import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { Component } from "../../ECS/Component";
import { SpawnerComponent } from "../Models/DynamicComponents";
import { CollisionEventComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { vec3 } from "gl-matrix";

export default class SpawnSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEvent", ["CollisionEvent"]],
            ["SpawnOnTimerTick", ["SpawnOnTimerTick", "TimerTickEvent"]],
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
            this.spawnOnCollisionWithRigidbody(ecs, event.entityId1, event.entityId2);
            this.spawnOnCollisionWithRigidbody(ecs, event.entityId2, event.entityId1);
        });

        entities = this.queryEntityGroup("SpawnOnTimerTick");

        entities.forEach((entity: Entity) => {
            this.spawn(ecs, entity.id);
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }

    private spawnOnCollisionWithRigidbody(ecs: ECSManager, myEntityId: number, otherEntityId: number)
    {
        if (ecs.hasComponent(myEntityId, "SpawnOnCollisionWithRigidbody") && ecs.hasComponent(otherEntityId, "Rigidbody"))
            this.spawn(ecs, myEntityId);
    }

    private spawn(ecs: ECSManager, myEntityId: number)
    {
        const spawner = ecs.getComponent(myEntityId, "Spawner") as SpawnerComponent;
        const spawnerTr = ecs.getComponent(myEntityId, "Transform") as TransformComponent;
        const spawnedEntity = ecs.addEntity(spawner.entityToSpawnConfigId);
        const spawnedEntityTr = ecs.getComponent(spawnedEntity.id, "Transform") as TransformComponent;
        vec3.add(spawnedEntityTr.position, spawnerTr.position, spawner.spawnOffset);
    }
}