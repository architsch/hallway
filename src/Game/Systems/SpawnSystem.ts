import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent, TransformChildComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { vec3 } from "gl-matrix";
import { SpawnAfterDelayComponent, SpawnOnCollisionComponent, SpawnOnIntervalComponent } from "../Models/DynamicComponents";

export default class SpawnSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEventComponent", ["CollisionEventComponent"]],
            ["SpawnAfterDelayComponent", ["SpawnAfterDelayComponent"]],
            ["SpawnOnIntervalComponent", ["SpawnOnIntervalComponent"]],
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

        entities = this.queryEntityGroup("SpawnAfterDelayComponent");

        entities.forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "SpawnAfterDelayComponent") as SpawnAfterDelayComponent;
            if (c.startTime == undefined)
            {
                c.startTime = t;
            }
            if (t > c.startTime + c.delay)
            {
                this.action(ecs, entity.id, c.entityToSpawnConfigId, c.spawnOffset);
                ecs.removeComponent(entity.id, "SpawnAfterDelayComponent");
            }
        });

        entities = this.queryEntityGroup("SpawnOnIntervalComponent");

        entities.forEach((entity: Entity) => {
            const c = ecs.getComponent(entity.id, "SpawnOnIntervalComponent") as SpawnOnIntervalComponent;
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

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private onCollision(ecs: ECSManager, myEntityId: number, otherEntityId: number)
    {
        if (ecs.hasComponent(myEntityId, "SpawnOnCollisionComponent"))
        {
            const c = ecs.getComponent(myEntityId, "SpawnOnCollisionComponent") as SpawnOnCollisionComponent;
            if ((c.myEntityComponentTypeRequired == undefined || ecs.hasComponent(myEntityId, c.myEntityComponentTypeRequired)) &&
                (c.otherEntityComponentTypeRequired == undefined || ecs.hasComponent(otherEntityId, c.otherEntityComponentTypeRequired)))
            {
                this.action(ecs, myEntityId, c.entityToSpawnConfigId, c.spawnOffset);
            }
        }
    }

    private action(ecs: ECSManager, spawnerEntityId: number, entityToSpawnConfigId: string, spawnOffset: vec3)
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
}