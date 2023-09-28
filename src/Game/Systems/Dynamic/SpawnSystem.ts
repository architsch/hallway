import ECSManager from "../../../ECS/ECSManager";
import Entity from "../../../ECS/Entity";
import System from "../../../ECS/System";
import { Component } from "../../../ECS/Component";
import { CollisionEventComponent, TransformChildComponent, TransformComponent } from "../../../Physics/Models/PhysicsComponents";
import { vec3 } from "gl-matrix";
import { SpawnAfterDelayComponent, SpawnOnCollisionComponent, SpawnOnIntervalComponent } from "../../Models/DynamicComponents";

export default class SpawnSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEvent", ["CollisionEvent"]],
            ["SpawnAfterDelay", ["SpawnAfterDelay"]],
            ["SpawnOnInterval", ["SpawnOnInterval"]],
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

        entities = this.queryEntityGroup("SpawnAfterDelay");

        entities.forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "SpawnAfterDelay") as SpawnAfterDelayComponent;
            if (c.startTime == undefined)
            {
                c.startTime = t;
            }
            if (t > c.startTime + c.delay)
            {
                this.action(ecs, entity.id, c.entityToSpawnConfigId, c.spawnOffset);
                ecs.removeComponent(entity.id, "SpawnAfterDelay");
            }
        });

        entities = this.queryEntityGroup("SpawnOnInterval");

        entities.forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "SpawnOnInterval") as SpawnOnIntervalComponent;
            if (c.startTime == undefined)
            {
                c.startTime = t;
            }
            if (t > c.startTime + c.interval)
            {
                this.action(ecs, entity.id, c.entityToSpawnConfigId, c.spawnOffset);
                c.startTime = t;
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
        if (ecs.hasComponent(myEntityId, "SpawnOnCollision"))
        {
            const c = ecs.getComponent(myEntityId, "SpawnOnCollision") as SpawnOnCollisionComponent;
            if ((c.myEntityComponentTypeRequired == undefined || ecs.hasComponent(myEntityId, c.myEntityComponentTypeRequired)) &&
                (c.otherEntityComponentTypeRequired == undefined || ecs.hasComponent(otherEntityId, c.otherEntityComponentTypeRequired)))
            {
                this.action(ecs, myEntityId, c.entityToSpawnConfigId, c.spawnOffset);
            }
        }
    }

    private action(ecs: ECSManager, spawnerEntityId: number, entityToSpawnConfigId: string, spawnOffset: vec3)
    {
        const spawnerTr = ecs.getComponent(spawnerEntityId, "Transform") as TransformComponent;
        const spawnedEntity = ecs.addEntity(entityToSpawnConfigId);
        const spawnedEntityTr = ecs.getComponent(spawnedEntity.id, "Transform") as TransformComponent;
        vec3.add(spawnedEntityTr.position, spawnerTr.position, spawnOffset);

        if (ecs.hasComponent(spawnedEntity.id, "TransformChild"))
        {
            const child = ecs.getComponent(spawnedEntity.id, "TransformChild") as TransformChildComponent;
            child.parentEntityId = spawnerEntityId;
            child.parentEntityBirthCount = ecs.getEntity(spawnerEntityId).birthCount;
        }
    }
}