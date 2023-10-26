import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { ColliderComponent, CollisionEventComponent, KinematicsComponent, RigidbodyComponent, TransformComponent } from "../Models/PhysicsComponents";
import Geom from "../../Util/Math/Geom";
import { CollisionPair } from "../Models/CollisionPair";

export default class MechanicalForceSystem extends System
{
    private softCollisionForceMultiplier = 30;
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

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEventComponent", ["CollisionEventComponent", "KinematicsComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const entities = this.queryEntityGroup("CollisionEventComponent");

        entities.forEach((entity: Entity) => {
            const event = ecs.getComponent(entity.id, "CollisionEventComponent") as CollisionEventComponent;

            for (const pair of event.collisionPairs)
            {
                let myRb: RigidbodyComponent | undefined = undefined;
                let otherRb: RigidbodyComponent | undefined = undefined;

                if (ecs.hasComponent(entity.id, "RigidbodyComponent"))
                    myRb = ecs.getComponent(entity.id, "RigidbodyComponent") as RigidbodyComponent;
                if (ecs.hasComponent(pair.collidingEntityId, "RigidbodyComponent"))
                    otherRb = ecs.getComponent(pair.collidingEntityId, "RigidbodyComponent") as RigidbodyComponent;

                if (myRb != undefined && otherRb != undefined)
                {
                    const myTr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
                    const myK = ecs.getComponent(entity.id, "KinematicsComponent") as KinematicsComponent;
                    
                    this.applySoftCollision(ecs, pair, myTr, myK, Math.max(myRb.rigidity, otherRb.rigidity));

                    const myCollider = ecs.getComponent(entity.id, "ColliderComponent") as ColliderComponent;
                    const hardCollisionX = pair.intersectionSizeX / myCollider.boundingBoxSize[0] >= myRb.softSurfaceDepth;
                    const hardCollisionY = pair.intersectionSizeY / myCollider.boundingBoxSize[1] >= myRb.softSurfaceDepth;
                    const hardCollisionZ = pair.intersectionSizeZ / myCollider.boundingBoxSize[2] >= myRb.softSurfaceDepth;
                    if (hardCollisionX && hardCollisionY && hardCollisionZ)
                        this.applyHardCollision(ecs, pair, myTr, myK, Math.max(myRb.elasticity, otherRb.elasticity));
                }
            }
        });
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private applySoftCollision(ecs: ECSManager, pair: CollisionPair, myTr: TransformComponent, myK: KinematicsComponent, effectiveRigidity: number)
    {
        const intersectionVolume = pair.intersectionSizeX * pair.intersectionSizeY * pair.intersectionSizeZ;
        const forceMultiplier = effectiveRigidity * intersectionVolume * this.softCollisionForceMultiplier;
        
        vec3.set(this.forceToApply,
            myTr.position[0] - pair.intersectionCenterX,
            myTr.position[1] - pair.intersectionCenterY,
            myTr.position[2] - pair.intersectionCenterZ);
        
        vec3.normalize(this.forceToApply, this.forceToApply);
        vec3.scale(this.forceToApply, this.forceToApply, forceMultiplier);
        vec3.add(myK.pendingForce, myK.pendingForce, this.forceToApply);
    }

    private applyHardCollision(ecs: ECSManager, pair: CollisionPair, myTr: TransformComponent, myK: KinematicsComponent, effectiveElasticity: number)
    {
        let otherK: KinematicsComponent | undefined = undefined;
        if (ecs.hasComponent(pair.collidingEntityId, "KinematicsComponent"))
            otherK = ecs.getComponent(pair.collidingEntityId, "KinematicsComponent") as KinematicsComponent;

        const minSize = Math.min(pair.intersectionSizeX, pair.intersectionSizeY, pair.intersectionSizeZ);
        let normal: vec3;
        if (minSize == pair.intersectionSizeX)
            normal = this.boundingBoxSurfaceNormals[(myTr.position[0] > pair.intersectionCenterX) ? 0 : 1];
        else if (minSize == pair.intersectionSizeY)
            normal = this.boundingBoxSurfaceNormals[(myTr.position[1] > pair.intersectionCenterY) ? 2 : 3];
        else if (minSize == pair.intersectionSizeZ)
            normal = this.boundingBoxSurfaceNormals[(myTr.position[2] > pair.intersectionCenterZ) ? 4 : 5];

        if (otherK != undefined)
            vec3.subtract(this.relativeVelocity, myK.velocity, otherK.velocity);
        else
            vec3.copy(this.relativeVelocity, myK.velocity);

        const velocityDot = vec3.dot(this.relativeVelocity, normal);
        if (velocityDot < 0)
            Geom.reflect(myK.velocity, normal, effectiveElasticity);
        else
        {
            vec3.set(this.velocityChange,
                myTr.position[0] - pair.intersectionCenterX,
                myTr.position[1] - pair.intersectionCenterY,
                myTr.position[2] - pair.intersectionCenterZ);
            
            vec3.normalize(this.velocityChange, this.velocityChange);
            let massRatio = 1;
            if (otherK != undefined)
                massRatio = otherK.mass / myK.mass;
            vec3.scale(this.velocityChange, this.velocityChange, velocityDot * massRatio);
            vec3.add(myK.velocity, myK.velocity, this.velocityChange);
        }

        vec3.set(this.positionChange,
            normal[0] * pair.intersectionSizeX,
            normal[1] * pair.intersectionSizeY,
            normal[2] * pair.intersectionSizeZ);
        
        vec3.add(myTr.position, myTr.position, this.positionChange);
        myTr.matrixSynced = false;
    }
}