import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent, KinematicsComponent, RigidbodyComponent, SoftbodyComponent, TransformComponent } from "../Models/PhysicsComponents";
import Geom from "../../Util/Math/Geom";

export default class CollisionForceSystem extends System
{
    private softbodyForceMultiplier = 30;
    private forceToApply: vec3 = vec3.create();
    private relativeVelocity: vec3 = vec3.create();
    private velocityChange: vec3 = vec3.create();
    private positionChange: vec3 = vec3.create();
    private boundingBoxSurfaceNormals: vec3[] = [
        vec3.fromValues(1, 0, 0),
        vec3.fromValues(-1, 0, 0),
        vec3.fromValues(0, 1, 0),
        vec3.fromValues(0, -1, 0),
        vec3.fromValues(0, 0, 1),
        vec3.fromValues(0, 0, -1),
    ];

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
                let sb1: SoftbodyComponent | undefined = undefined;
                let sb2: SoftbodyComponent | undefined = undefined;

                if (ecs.hasComponent(event.entityId1, "Rigidbody"))
                    rb1 = ecs.getComponent(event.entityId1, "Rigidbody") as RigidbodyComponent;
                if (ecs.hasComponent(event.entityId2, "Rigidbody"))
                    rb2 = ecs.getComponent(event.entityId2, "Rigidbody") as RigidbodyComponent;
                if (ecs.hasComponent(event.entityId1, "Softbody"))
                    sb1 = ecs.getComponent(event.entityId1, "Softbody") as SoftbodyComponent;
                if (ecs.hasComponent(event.entityId2, "Softbody"))
                    sb2 = ecs.getComponent(event.entityId2, "Softbody") as SoftbodyComponent;

                if (sb1 != undefined || sb2 != undefined)
                {
                    if (rb1 != undefined || sb1 != undefined)
                        this.applySoftbodyCollision(ecs, event, event.entityId1, (sb1 != undefined) ? sb1.rigidity : sb2.rigidity);
                    if (rb2 != undefined || sb2 != undefined)
                        this.applySoftbodyCollision(ecs, event, event.entityId2, (sb2 != undefined) ? sb2.rigidity : sb1.rigidity);
                }
                else
                {
                    if (rb1 != undefined && rb2 != undefined)
                    {
                        this.applyMutualRigidbodyCollision(ecs, event, event.entityId1,
                            ecs.getComponent(event.entityId1, "Kinematics") as KinematicsComponent,
                            ecs.getComponent(event.entityId2, "Kinematics") as KinematicsComponent,
                            rb1.elasticity);
                        this.applyMutualRigidbodyCollision(ecs, event, event.entityId2,
                            ecs.getComponent(event.entityId2, "Kinematics") as KinematicsComponent,
                            ecs.getComponent(event.entityId1, "Kinematics") as KinematicsComponent,
                            rb2.elasticity);
                    }
                    else if (rb1 != undefined)
                        this.applySingleRigidbodyCollision(ecs, event, event.entityId1, ecs.getComponent(event.entityId1, "Kinematics") as KinematicsComponent, rb1.elasticity);
                    else if (rb2 != undefined)
                        this.applySingleRigidbodyCollision(ecs, event, event.entityId2, ecs.getComponent(event.entityId2, "Kinematics") as KinematicsComponent, rb2.elasticity);
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

    private applySoftbodyCollision(ecs: ECSManager, event: CollisionEventComponent, entityId: number, effectiveRigidity: number)
    {
        const tr = ecs.getComponent(entityId, "Transform") as TransformComponent;
        const kinematics = ecs.getComponent(entityId, "Kinematics") as KinematicsComponent;

        const intersectionVolume = event.intersectionSize[0] * event.intersectionSize[1] * event.intersectionSize[2];
        const forceMultiplier = effectiveRigidity * intersectionVolume * this.softbodyForceMultiplier;
        vec3.subtract(this.forceToApply, tr.position, event.intersectionCenter);
        vec3.normalize(this.forceToApply, this.forceToApply);
        vec3.scale(this.forceToApply, this.forceToApply, forceMultiplier);
        vec3.add(kinematics.pendingForce, kinematics.pendingForce, this.forceToApply);
    }

    private applySingleRigidbodyCollision(ecs: ECSManager, event: CollisionEventComponent, entityId: number,
        myK: KinematicsComponent, effectiveElasticity: number)
    {
        const tr = ecs.getComponent(entityId, "Transform") as TransformComponent;

        const minSize = Math.min(event.intersectionSize[0], event.intersectionSize[1], event.intersectionSize[2]);
        let normal: vec3;
        if (minSize == event.intersectionSize[0])
            normal = this.boundingBoxSurfaceNormals[(tr.position[0] > event.intersectionCenter[0]) ? 0 : 1];
        else if (minSize == event.intersectionSize[1])
            normal = this.boundingBoxSurfaceNormals[(tr.position[1] > event.intersectionCenter[1]) ? 2 : 3];
        else if (minSize == event.intersectionSize[2])
            normal = this.boundingBoxSurfaceNormals[(tr.position[2] > event.intersectionCenter[2]) ? 4 : 5];

        const velocityDot = vec3.dot(myK.velocity, normal);
        if (velocityDot < 0)
            Geom.reflect(myK.velocity, normal, effectiveElasticity);

        vec3.multiply(this.positionChange, normal, event.intersectionSize);
        vec3.add(tr.position, tr.position, this.positionChange);
    }

    private applyMutualRigidbodyCollision(ecs: ECSManager, event: CollisionEventComponent, entityId: number,
        myK: KinematicsComponent, otherK: KinematicsComponent, effectiveElasticity: number)
    {
        const tr = ecs.getComponent(entityId, "Transform") as TransformComponent;

        const minSize = Math.min(event.intersectionSize[0], event.intersectionSize[1], event.intersectionSize[2]);
        let normal: vec3;
        if (minSize == event.intersectionSize[0])
            normal = this.boundingBoxSurfaceNormals[(tr.position[0] > event.intersectionCenter[0]) ? 0 : 1];
        else if (minSize == event.intersectionSize[1])
            normal = this.boundingBoxSurfaceNormals[(tr.position[1] > event.intersectionCenter[1]) ? 2 : 3];
        else if (minSize == event.intersectionSize[2])
            normal = this.boundingBoxSurfaceNormals[(tr.position[2] > event.intersectionCenter[2]) ? 4 : 5];

        vec3.subtract(this.relativeVelocity, myK.velocity, otherK.velocity);

        const velocityDot = vec3.dot(this.relativeVelocity, normal);
        if (velocityDot < 0)
            Geom.reflect(myK.velocity, normal, effectiveElasticity);
        else
        {
            vec3.subtract(this.velocityChange, tr.position, event.intersectionCenter);
            vec3.normalize(this.velocityChange, this.velocityChange);
            vec3.scale(this.velocityChange, this.velocityChange, velocityDot * (otherK.mass / myK.mass));
            vec3.add(myK.velocity, myK.velocity, this.velocityChange);
        }

        vec3.multiply(this.positionChange, normal, event.intersectionSize);
        vec3.add(tr.position, tr.position, this.positionChange);
    }
}