import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { RigidbodyComponent, TransformComponent } from "../Models/PhysicsComponents";

export default class KinematicsSystem extends System
{
    private acceleration: vec3 = vec3.create();
    private forceReduction: vec3 = vec3.create();
    private displacement: vec3 = vec3.create();
    private deceleration: vec3 = vec3.create();

    private gravity: vec3 = vec3.fromValues(0, -1, 0);

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Rigidbody", ["Transform", "Rigidbody"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const rigidbodyEntities = this.entityGroups["Rigidbody"];

        rigidbodyEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const rb = ecs.getComponent(entity.id, "Rigidbody") as RigidbodyComponent;

            // Update the current acceleration and velocity.
            vec3.scale(this.acceleration, rb.force, dt / rb.mass);
            vec3.add(this.acceleration, this.acceleration, this.gravity);
            vec3.add(rb.velocity, rb.velocity, this.acceleration);

            // Damp out the current force.

            vec3.negate(this.forceReduction, rb.force);
            vec3.normalize(this.forceReduction, this.forceReduction);
            const forceMag = vec3.length(rb.force);
            const forceReductionMag = Math.min(forceMag, forceMag * 10 * dt);
            vec3.scale(this.forceReduction, this.forceReduction, forceReductionMag);
            vec3.add(rb.force, rb.force, this.forceReduction);

            const velocitySqrMag = vec3.squaredLength(rb.velocity);
            
            if (velocitySqrMag > 0.0025)
            {
                // Displace
                vec3.scale(this.displacement, rb.velocity, dt);
                vec3.add(tr.position, tr.position, this.displacement);

                // Decelerate
                vec3.scale(this.deceleration, rb.velocity, rb.decelerationRate * dt);
                vec3.subtract(rb.velocity, rb.velocity, this.deceleration);
                
                tr.matrixSynced = false;
            }
            else // Velocity is negligibly small
            {
                vec3.set(rb.velocity, 0, 0, 0);
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