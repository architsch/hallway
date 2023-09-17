import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent, KinematicsComponent, RigidbodyComponent, SoftbodyComponent, TransformComponent } from "../Models/PhysicsComponents";
import Geom from "../../Util/Math/Geom";
import { Component } from "../../ECS/Component";

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

                if ((sb1 != undefined || rb1 != undefined) && (sb2 != undefined || rb2 != undefined))
                {
                    if (sb1 != undefined || sb2 != undefined) // At least either of them is a softbody.
                    {
                        this.applySoftbodyCollision(ecs, event, event.entityId1, (sb1 != undefined) ? sb1.rigidity : sb2.rigidity);
                        this.applySoftbodyCollision(ecs, event, event.entityId2, (sb2 != undefined) ? sb2.rigidity : sb1.rigidity);
                    }
                    else
                    {
                        if (rb1 != undefined)
                            this.applyRigidbodyCollision(ecs, event, event.entityId1, event.entityId2, rb1.elasticity);
                        if (rb2 != undefined)
                            this.applyRigidbodyCollision(ecs, event, event.entityId2, event.entityId1, rb2.elasticity);
                    }
                }
            }
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }

    private applySoftbodyCollision(ecs: ECSManager, event: CollisionEventComponent, entityId: number, effectiveRigidity: number)
    {
        if (ecs.hasComponent(entityId, "Kinematics"))
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
    }

    private applyRigidbodyCollision(ecs: ECSManager, event: CollisionEventComponent, myEntityId: number, otherEntityId: number, effectiveElasticity: number)
    {
        if (ecs.hasComponent(myEntityId, "Kinematics"))
        {
            const myTr = ecs.getComponent(myEntityId, "Transform") as TransformComponent;
            const myK = ecs.getComponent(myEntityId, "Kinematics") as KinematicsComponent;

            let otherK: KinematicsComponent | undefined = undefined;
            if (ecs.hasComponent(otherEntityId, "Kinematics"))
                otherK = ecs.getComponent(otherEntityId, "Kinematics") as KinematicsComponent;

            const minSize = Math.min(event.intersectionSize[0], event.intersectionSize[1], event.intersectionSize[2]);
            let normal: vec3;
            if (minSize == event.intersectionSize[0])
                normal = this.boundingBoxSurfaceNormals[(myTr.position[0] > event.intersectionCenter[0]) ? 0 : 1];
            else if (minSize == event.intersectionSize[1])
                normal = this.boundingBoxSurfaceNormals[(myTr.position[1] > event.intersectionCenter[1]) ? 2 : 3];
            else if (minSize == event.intersectionSize[2])
                normal = this.boundingBoxSurfaceNormals[(myTr.position[2] > event.intersectionCenter[2]) ? 4 : 5];

            if (otherK != undefined)
                vec3.subtract(this.relativeVelocity, myK.velocity, otherK.velocity);
            else
                vec3.copy(this.relativeVelocity, myK.velocity);

            const velocityDot = vec3.dot(this.relativeVelocity, normal);
            if (velocityDot < 0)
                Geom.reflect(myK.velocity, normal, effectiveElasticity);
            else
            {
                vec3.subtract(this.velocityChange, myTr.position, event.intersectionCenter);
                vec3.normalize(this.velocityChange, this.velocityChange);
                let massRatio = 1;
                if (otherK != undefined)
                    massRatio = otherK.mass / myK.mass;
                vec3.scale(this.velocityChange, this.velocityChange, velocityDot * massRatio);
                vec3.add(myK.velocity, myK.velocity, this.velocityChange);
            }

            vec3.multiply(this.positionChange, normal, event.intersectionSize);
            vec3.add(myTr.position, myTr.position, this.positionChange);
        }
    }
}