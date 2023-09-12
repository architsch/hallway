import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { RigidbodyComponent, TransformComponent } from "../Models/PhysicsComponents";

export default class KinematicsSystem extends System
{
    private acceleration: vec3 = vec3.create();
    private changeInVelocity: vec3 = vec3.create();
    private changeInPosition: vec3 = vec3.create();
    private deceleration: vec3 = vec3.create();

    private gravity: vec3 = vec3.fromValues(0, -15, 0);

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
        const rigidbodyEntities = this.queryEntityGroup("Rigidbody");

        rigidbodyEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const rb = ecs.getComponent(entity.id, "Rigidbody") as RigidbodyComponent;

            // Update the current acceleration and velocity.
            vec3.scale(this.acceleration, rb.force, 1 / rb.mass); // Apply the pending force.
            vec3.add(this.acceleration, this.acceleration, this.gravity); // Apply the gravitational acceleration.
            vec3.scale(this.changeInVelocity, this.acceleration, dt);
            vec3.add(rb.velocity, rb.velocity, this.changeInVelocity); // Update the velocity based on the acceleration.

            // Zero out the force because it's been applied (consumed).
            vec3.set(rb.force, 0, 0, 0);

            const velocitySqrMag = vec3.squaredLength(rb.velocity);
            
            if (velocitySqrMag > 0.0025)
            {
                // Displace
                vec3.scale(this.changeInPosition, rb.velocity, dt);
                vec3.add(tr.position, tr.position, this.changeInPosition);

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