import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { KinematicsComponent, TransformComponent } from "../Models/PhysicsComponents";

export default class KinematicsSystem extends System
{
    private acceleration: vec3 = vec3.create();
    private changeInVelocity: vec3 = vec3.create();
    private changeInPosition: vec3 = vec3.create();
    private deceleration: vec3 = vec3.create();

    private gravity: vec3 = vec3.fromValues(0, -15, 0);
    private scaledGravity: vec3 = vec3.create();

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["KinematicsComponent", ["TransformComponent", "KinematicsComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const kinematicsEntities = this.queryEntityGroup("KinematicsComponent");

        kinematicsEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
            const kinematics = ecs.getComponent(entity.id, "KinematicsComponent") as KinematicsComponent;

            // Update the current acceleration and velocity.
            vec3.scale(this.acceleration, kinematics.pendingForce, 1 / kinematics.mass); // Apply the pending force.
            vec3.scale(this.scaledGravity, this.gravity, kinematics.gravityMultiplier);
            vec3.add(this.acceleration, this.acceleration, this.scaledGravity); // Apply the gravitational acceleration.
            vec3.scale(this.changeInVelocity, this.acceleration, dt);
            vec3.add(kinematics.velocity, kinematics.velocity, this.changeInVelocity); // Update the velocity based on the acceleration.

            // Zero out the force because it's been applied (consumed).
            vec3.set(kinematics.pendingForce, 0, 0, 0);

            let velocityMag = vec3.length(kinematics.velocity);
            
            if (velocityMag > 0.05)
            {
                // Displace
                vec3.scale(this.changeInPosition, kinematics.velocity, dt);
                vec3.add(tr.position, tr.position, this.changeInPosition);

                // Decelerate
                vec3.scale(this.deceleration, kinematics.velocity, kinematics.decelerationRate * dt);
                vec3.subtract(kinematics.velocity, kinematics.velocity, this.deceleration);
                
                tr.matrixSynced = false;
            }
            else // Velocity is negligibly small
            {
                vec3.set(kinematics.velocity, 0, 0, 0);
            }
        });
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}