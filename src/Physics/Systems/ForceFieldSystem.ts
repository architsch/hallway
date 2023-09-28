import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent, ConstantForceFieldComponent, KinematicsComponent, RadialForceFieldComponent, TransformChildComponent, TransformComponent } from "../Models/PhysicsComponents";
import { Component } from "../../ECS/Component";

export default class ForceFieldSystem extends System
{
    private forceToApply: vec3 = vec3.create();

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
            this.tryApplyConstantForceField(ecs, event.entityId1, event.entityId2);
            this.tryApplyConstantForceField(ecs, event.entityId2, event.entityId1);
            this.tryApplyRadialForceField(ecs, event.entityId1, event.entityId2);
            this.tryApplyRadialForceField(ecs, event.entityId2, event.entityId1);
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }

    private tryApplyConstantForceField(ecs: ECSManager, entityIdFrom: number, entityIdTo: number)
    {
        if (ecs.hasComponent(entityIdFrom, "ConstantForceField") && ecs.hasComponent(entityIdTo, "Kinematics"))
        {
            if (ecs.hasComponent(entityIdFrom, "TransformChild")) // Don't apply force to the parent entity.
            {
                const child = ecs.getComponent(entityIdFrom, "TransformChild") as TransformChildComponent;
                if (entityIdTo == child.parentEntityId)
                    return;
            }
            const field = ecs.getComponent(entityIdFrom, "ConstantForceField") as ConstantForceFieldComponent;
            const kinematics = ecs.getComponent(entityIdTo, "Kinematics") as KinematicsComponent;
            vec3.add(kinematics.pendingForce, kinematics.pendingForce, field.force);
        }
    }

    private tryApplyRadialForceField(ecs: ECSManager, entityIdFrom: number, entityIdTo: number)
    {
        if (ecs.hasComponent(entityIdFrom, "RadialForceField") && ecs.hasComponent(entityIdTo, "Kinematics"))
        {
            if (ecs.hasComponent(entityIdFrom, "TransformChild")) // Don't apply force to the parent entity.
            {
                const child = ecs.getComponent(entityIdFrom, "TransformChild") as TransformChildComponent;
                if (entityIdTo == child.parentEntityId)
                    return;
            }
            const fieldTr = ecs.getComponent(entityIdFrom, "Transform") as TransformComponent;
            const field = ecs.getComponent(entityIdFrom, "RadialForceField") as RadialForceFieldComponent;
            const kinematicsTr = ecs.getComponent(entityIdTo, "Transform") as TransformComponent;
            const kinematics = ecs.getComponent(entityIdTo, "Kinematics") as KinematicsComponent;

            vec3.subtract(this.forceToApply, kinematicsTr.position, fieldTr.position);
            const dist = vec3.length(this.forceToApply);
            if (dist >= field.forceFalloffEndRadius)
                return;

            vec3.normalize(this.forceToApply, this.forceToApply);
            
            if (dist <= field.forceFalloffStartRadius)
                vec3.scale(this.forceToApply, this.forceToApply, field.forceIntensity);
            else
                vec3.scale(this.forceToApply, this.forceToApply, field.forceIntensity - field.forceIntensity * ((dist - field.forceFalloffStartRadius) / (field.forceFalloffEndRadius - field.forceFalloffStartRadius)));
            
            vec3.add(kinematics.pendingForce, kinematics.pendingForce, this.forceToApply);
        }
    }
}