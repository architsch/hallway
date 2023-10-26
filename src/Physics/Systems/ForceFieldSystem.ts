import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { CollisionEventComponent, ConstantForceFieldComponent, KinematicsComponent, RadialForceFieldComponent, TransformChildComponent, TransformComponent } from "../Models/PhysicsComponents";

export default class ForceFieldSystem extends System
{
    private forceToApply: vec3 = vec3.create();

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEventComponent", ["CollisionEventComponent"]],
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
                this.tryApplyConstantForceField(ecs, entity.id, pair.collidingEntityId);
                this.tryApplyRadialForceField(ecs, entity.id, pair.collidingEntityId);
            }
        });
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private tryApplyConstantForceField(ecs: ECSManager, entityIdFrom: number, entityIdTo: number)
    {
        if (ecs.hasComponent(entityIdFrom, "ConstantForceFieldComponent") && ecs.hasComponent(entityIdTo, "KinematicsComponent"))
        {
            if (ecs.hasComponent(entityIdFrom, "TransformChildComponent")) // Don't apply force to the parent entity.
            {
                const child = ecs.getComponent(entityIdFrom, "TransformChildComponent") as TransformChildComponent;
                if (entityIdTo == child.parentEntityId)
                    return;
            }
            const field = ecs.getComponent(entityIdFrom, "ConstantForceFieldComponent") as ConstantForceFieldComponent;
            const kinematics = ecs.getComponent(entityIdTo, "KinematicsComponent") as KinematicsComponent;
            vec3.add(kinematics.pendingForce, kinematics.pendingForce, field.force);
        }
    }

    private tryApplyRadialForceField(ecs: ECSManager, entityIdFrom: number, entityIdTo: number)
    {
        if (ecs.hasComponent(entityIdFrom, "RadialForceFieldComponent") && ecs.hasComponent(entityIdTo, "KinematicsComponent"))
        {
            if (ecs.hasComponent(entityIdFrom, "TransformChildComponent")) // Don't apply force to the parent entity.
            {
                const child = ecs.getComponent(entityIdFrom, "TransformChildComponent") as TransformChildComponent;
                if (entityIdTo == child.parentEntityId)
                    return;
            }
            const fieldTr = ecs.getComponent(entityIdFrom, "TransformComponent") as TransformComponent;
            const field = ecs.getComponent(entityIdFrom, "RadialForceFieldComponent") as RadialForceFieldComponent;
            const kinematicsTr = ecs.getComponent(entityIdTo, "TransformComponent") as TransformComponent;
            const kinematics = ecs.getComponent(entityIdTo, "KinematicsComponent") as KinematicsComponent;

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