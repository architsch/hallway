import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent, RigidbodyComponent, TransformComponent } from "../Models/PhysicsComponents";

export default class CollisionForceSystem extends System
{
    private globalForceMultiplier = 20;
    private force: vec3 = vec3.create();

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEvent", ["CollisionEvent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const eventEntities = this.queryEntityGroup("CollisionEvent");

        eventEntities.forEach((eventEntity: Entity) => {
            const event = ecs.getComponent(eventEntity.id, "CollisionEvent") as CollisionEventComponent;

            if (ecs.isEntityAlive(event.entityId1) && ecs.isEntityAlive(event.entityId2))
            {
                let rb1: RigidbodyComponent | undefined = undefined;
                let rb2: RigidbodyComponent | undefined = undefined;

                if (ecs.hasComponent(event.entityId1, "Rigidbody"))
                    rb1 = ecs.getComponent(event.entityId1, "Rigidbody") as RigidbodyComponent;
                if (ecs.hasComponent(event.entityId1, "Rigidbody"))
                    rb2 = ecs.getComponent(event.entityId2, "Rigidbody") as RigidbodyComponent;

                if (rb1 != undefined || rb2 != undefined)
                {
                    const tr1 = ecs.getComponent(event.entityId1, "Transform") as TransformComponent;
                    const tr2 = ecs.getComponent(event.entityId2, "Transform") as TransformComponent;
                    const center = event.intersectionCenter;

                    const rigidityWeight = (rb1 != undefined ? 1 : 0) + (rb2 != undefined ? 1 : 0);
                    const rigiditySum = (rb1 != undefined ? rb1.rigidity : 0) + (rb2 != undefined ? rb2.rigidity : 0);
                    const avgRigidity = rigiditySum / rigidityWeight;
                    const forceMultiplier = avgRigidity * event.intersectionVolume * this.globalForceMultiplier;

                    if (rb2 != undefined)
                    {
                        vec3.subtract(this.force, tr2.position, center);
                        vec3.normalize(this.force, this.force);
                        vec3.scale(this.force, this.force, forceMultiplier);
                        vec3.add(rb2.force, rb2.force, this.force);
                    }
                    if (rb1 != undefined)
                    {
                        vec3.subtract(this.force, tr1.position, center);
                        vec3.normalize(this.force, this.force);
                        vec3.scale(this.force, this.force, forceMultiplier);
                        vec3.add(rb1.force, rb1.force, this.force);
                    }
                }
            }
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}