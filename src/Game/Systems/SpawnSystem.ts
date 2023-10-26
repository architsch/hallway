import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent, TransformChildComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { vec3 } from "gl-matrix";
import { SpawnAfterDelayComponent, SpawnOnCollisionWithRigidbodyComponent, SpawnOnIntervalComponent } from "../Models/DynamicComponents";

export default class SpawnSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEventComponent", ["CollisionEventComponent", "SpawnOnCollisionWithRigidbodyComponent"]],
            ["SpawnAfterDelayComponent", ["SpawnAfterDelayComponent"]],
            ["SpawnOnIntervalComponent", ["SpawnOnIntervalComponent"]],
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
                {
                    const c = ecs.getComponent(entity.id, "SpawnOnCollisionWithRigidbodyComponent") as SpawnOnCollisionWithRigidbodyComponent;
                    this.spawn(ecs, entity.id, c.entityToSpawnConfigId, c.spawnOffset);
                }
            }
        });

        this.queryEntityGroup("SpawnAfterDelayComponent").forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "SpawnAfterDelayComponent") as SpawnAfterDelayComponent;
            if (c.startTime == undefined)
            {
                c.startTime = t;
            }
            if (t > c.startTime + c.delay)
            {
                this.spawn(ecs, entity.id, c.entityToSpawnConfigId, c.spawnOffset);
                ecs.removeComponent(entity.id, "SpawnAfterDelayComponent");
            }
        });

        this.queryEntityGroup("SpawnOnIntervalComponent").forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "SpawnOnIntervalComponent") as SpawnOnIntervalComponent;
            if (c.startTime == undefined)
            {
                c.startTime = t;
            }
            if (t > c.startTime + c.interval)
            {
                this.spawn(ecs, entity.id, c.entityToSpawnConfigId, c.spawnOffset);
                c.startTime = t;
            }
        });
    }

    private spawn(ecs: ECSManager, spawnerEntityId: number, entityToSpawnConfigId: string, spawnOffset: vec3)
    {
        const spawnerTr = ecs.getComponent(spawnerEntityId, "TransformComponent") as TransformComponent;
        const spawnedEntity = ecs.addEntity(entityToSpawnConfigId);
        const spawnedEntityTr = ecs.getComponent(spawnedEntity.id, "TransformComponent") as TransformComponent;
        vec3.add(spawnedEntityTr.position, spawnerTr.position, spawnOffset);
        spawnedEntityTr.matrixSynced = false;

        if (ecs.hasComponent(spawnedEntity.id, "TransformChildComponent"))
        {
            const child = ecs.getComponent(spawnedEntity.id, "TransformChildComponent") as TransformChildComponent;
            child.parentEntityId = spawnerEntityId;
        }
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}