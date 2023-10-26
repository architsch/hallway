import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { ColliderComponent, CollisionEventComponent, TransformComponent } from "../Models/PhysicsComponents";
import { CollisionPair, CollisionPairPool } from "../Models/CollisionPair";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;

export default class CollisionDetectionSystem extends System
{
    private entityIdsByVoxelCoords: number[][];
    private boundingBoxSizeHalf: vec3 = vec3.create();

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["ColliderComponent", ["TransformComponent", "ColliderComponent"]],
            ["CollisionEventComponent", ["CollisionEventComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
        this.mark = this.mark.bind(this);
        this.detectCollision = this.detectCollision.bind(this);
        
        const g = globalPropertiesConfig;

        this.entityIdsByVoxelCoords = new Array<number[]>(g.worldBoundSizeInVoxels[0] * g.worldBoundSizeInVoxels[1] * g.worldBoundSizeInVoxels[2]);
        for (let i = 0; i < this.entityIdsByVoxelCoords.length; ++i)
            this.entityIdsByVoxelCoords[i] = [];
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        // Clean up the voxels before marking them with entityIds.
        for (const entityIds of this.entityIdsByVoxelCoords)
            entityIds.length = 0;

        if (this.queryEntityGroup("CollisionEventComponent").size > 0)
            throw new Error(`CollisionEventComponent detected. This shouldn't happen at the beginning of the collision detection stage.`);

        // Calculate bounding-box dimensions, and mark their overlapping voxels.
        this.queryEntityGroup("ColliderComponent").forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
            const collider = ecs.getComponent(entity.id, "ColliderComponent") as ColliderComponent;
    
            vec3.scale(this.boundingBoxSizeHalf, collider.boundingBoxSize, 0.5);
            vec3.subtract(collider.boundingBoxMin, tr.position, this.boundingBoxSizeHalf);
            vec3.add(collider.boundingBoxMax, tr.position, this.boundingBoxSizeHalf);
    
            vec3.set(collider.boundingBoxVoxelCoordsMin,
                Math.floor(g.worldBoundSizeInVoxels[0] * (collider.boundingBoxMin[0] - g.worldBoundMin[0]) / g.worldBoundSize[0]),
                Math.floor(g.worldBoundSizeInVoxels[1] * (collider.boundingBoxMin[1] - g.worldBoundMin[1]) / g.worldBoundSize[1]),
                Math.floor(g.worldBoundSizeInVoxels[2] * (collider.boundingBoxMin[2] - g.worldBoundMin[2]) / g.worldBoundSize[2])
            );
            vec3.set(collider.boundingBoxVoxelCoordsMax,
                Math.floor(g.worldBoundSizeInVoxels[0] * (collider.boundingBoxMax[0] - g.worldBoundMin[0]) / g.worldBoundSize[0]),
                Math.floor(g.worldBoundSizeInVoxels[1] * (collider.boundingBoxMax[1] - g.worldBoundMin[1]) / g.worldBoundSize[1]),
                Math.floor(g.worldBoundSizeInVoxels[2] * (collider.boundingBoxMax[2] - g.worldBoundMin[2]) / g.worldBoundSize[2])
            );

            const coordsMin = collider.boundingBoxVoxelCoordsMin;
            const coordsMax = collider.boundingBoxVoxelCoordsMax;

            if (coordsMin[0] < 0 || coordsMin[1] < 0 || coordsMin[2] < 0 ||
                coordsMax[0] >= g.worldBoundSizeInVoxels[0] ||
                coordsMax[1] >= g.worldBoundSizeInVoxels[1] ||
                coordsMax[2] >= g.worldBoundSizeInVoxels[2])
            {
                ecs.removeEntity(entity.id); // Remove any collider which touches the world's bound.
            }
            else
            {
                this.forEachVoxel(ecs, t, dt, entity, this.mark);
            }
        });

        // Register collision events.
        this.queryEntityGroup("ColliderComponent").forEach((entity: Entity) => {
            this.forEachVoxel(ecs, t, dt, entity, this.detectCollision);
        });

        //console.log(this.queryEntityGroup("CollisionEventComponent").size);
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private forEachVoxel(ecs: ECSManager, t: number, dt: number, entity: Entity,
        functionToRun: (ecs: ECSManager, t: number, dt: number, entity: Entity, voxelEntityIds: number[]) => void)
    {
        const collider = ecs.getComponent(entity.id, "ColliderComponent") as ColliderComponent;

        const coordsMin = collider.boundingBoxVoxelCoordsMin;
        const coordsMax = collider.boundingBoxVoxelCoordsMax;

        const coordsX1 = Math.max(0, coordsMin[0]);
        const coordsX2 = Math.min(g.worldBoundSizeInVoxels[0]-1, coordsMax[0]);
        const coordsY1 = Math.max(0, coordsMin[1]);
        const coordsY2 = Math.min(g.worldBoundSizeInVoxels[1]-1, coordsMax[1]);
        const coordsZ1 = Math.max(0, coordsMin[2]);
        const coordsZ2 = Math.min(g.worldBoundSizeInVoxels[2]-1, coordsMax[2]);

        for (let voxelX = coordsX1; voxelX <= coordsX2; ++voxelX)
        {
            for (let voxelY = coordsY1; voxelY <= coordsY2; ++voxelY)
            {
                for (let voxelZ = coordsZ1; voxelZ <= coordsZ2; ++voxelZ)
                {
                    const index = voxelX + g.worldBoundSizeInVoxels[0]*voxelY + g.worldBoundSizeInVoxels[0]*g.worldBoundSizeInVoxels[1]*voxelZ;
                    const voxelEntityIds = this.entityIdsByVoxelCoords[index];
                    functionToRun(ecs, t, dt, entity, voxelEntityIds);
                }
            }
        }
    }

    private mark(ecs: ECSManager, t: number, dt: number, entity: Entity, voxelEntityIds: number[])
    {
        voxelEntityIds.push(entity.id);
    }

    private detectCollision(ecs: ECSManager, t: number, dt: number, myEntity: Entity, voxelEntityIds: number[])
    {
        const myCollider = ecs.getComponent(myEntity.id, "ColliderComponent") as ColliderComponent;

        if (myCollider.detectCollisions)
        {
            for (const otherEntityId of voxelEntityIds)
            {
                if (otherEntityId != myEntity.id)
                {
                    const otherCollider = ecs.getComponent(otherEntityId, "ColliderComponent") as ColliderComponent;

                    const xOverlap = myCollider.boundingBoxMin[0] <= otherCollider.boundingBoxMax[0] && myCollider.boundingBoxMax[0] >= otherCollider.boundingBoxMin[0];
                    const yOverlap = myCollider.boundingBoxMin[1] <= otherCollider.boundingBoxMax[1] && myCollider.boundingBoxMax[1] >= otherCollider.boundingBoxMin[1];
                    const zOverlap = myCollider.boundingBoxMin[2] <= otherCollider.boundingBoxMax[2] && myCollider.boundingBoxMax[2] >= otherCollider.boundingBoxMin[2];

                    if (xOverlap && yOverlap && zOverlap) // These two entities are colliding with each other.
                    {
                        let event: CollisionEventComponent;
                        if (ecs.hasComponent(myEntity.id, "CollisionEventComponent"))
                        {
                            event = ecs.getComponent(myEntity.id, "CollisionEventComponent") as CollisionEventComponent;
                        }
                        else
                        {
                            event = ecs.addComponent(myEntity.id, "CollisionEventComponent") as CollisionEventComponent;
                            ecs.processLastPendingAddComponentCommand(); // Add the component immediately.
                            ecs.removeComponent(myEntity.id, "CollisionEventComponent"); // Make the event last only till the end of this frame.
                        }

                        let N = event.collisionPairs.length;

                        let alreadyDetected = false;
                        for (let i = 0; i < N; ++i)
                        {
                            if (otherEntityId == event.collisionPairs[i].collidingEntityId)
                            {
                                alreadyDetected = true;
                                break;
                            }
                        }

                        if (!alreadyDetected)
                        {
                            const newCollisionPair = CollisionPairPool.rent();
                            newCollisionPair.collidingEntityId = otherEntityId;
                            this.updateIntersectionStatus(newCollisionPair, myCollider, otherCollider, 0);
                            this.updateIntersectionStatus(newCollisionPair, myCollider, otherCollider, 1);
                            this.updateIntersectionStatus(newCollisionPair, myCollider, otherCollider, 2);
                            event.collisionPairs.push(newCollisionPair);
                            
                            N = event.collisionPairs.length;
                            if (N > g.maxNumEstimatedCollisionPairsPerEntity)
                            {
                                const otherEntityStrs = new Array<string>(N);
                                for (let i = 0; i < N; ++i)
                                {
                                    const id = event.collisionPairs[i].collidingEntityId;
                                    otherEntityStrs[i] = `${id}:${ecs.getEntity(i).configId}`;
                                }
                                console.warn(`Too many simultaneous collision pairs :: ${N} (myEntity = ${myEntity.id}:${ecs.getEntity(myEntity.id).configId}, otherEntities = [${otherEntityStrs.join(", ")}])`);
                            }
                        }
                    }
                }
            }
        }
    }

    // (The given two colliders, c1 and c2, must be overlapping)
    private updateIntersectionStatus(collisionPair: CollisionPair, c1: ColliderComponent, c2: ColliderComponent, dimensionIndex: number)
    {
        const c1min = c1.boundingBoxMin[dimensionIndex];
        const c1max = c1.boundingBoxMax[dimensionIndex];
        const c2min = c2.boundingBoxMin[dimensionIndex];
        const c2max = c2.boundingBoxMax[dimensionIndex];
        const c2_lowerBoundIsInside = c2min >= c1min;
        const c2_upperBoundIsInside = c2max <= c1max;

        let intersectionWidth = 0;
        let intersectionCenter = 0;

        if (c2_lowerBoundIsInside && c2_upperBoundIsInside) // c2 is inside c1
        {
            intersectionWidth = c2.boundingBoxSize[dimensionIndex];
            intersectionCenter = 0.5 * (c2min + c2max);
        }
        else if (c2_lowerBoundIsInside) // c2 tends toward the upper side of c1
        {
            intersectionWidth = c1max - c2min;
            intersectionCenter = 0.5 * (c1max + c2min);
        }
        else if (c2_upperBoundIsInside) // c2 tends toward the lower side of c1
        {
            intersectionWidth = c2max - c1min;
            intersectionCenter = 0.5 * (c2max + c1min);
        }
        else // c1 is inside c2
        {
            intersectionWidth = c1.boundingBoxSize[dimensionIndex];
            intersectionCenter = 0.5 * (c1min + c1max);
        }

        collisionPair.intersectionSizeX = (dimensionIndex == 0) ? intersectionWidth : collisionPair.intersectionSizeX;
        collisionPair.intersectionSizeY = (dimensionIndex == 1) ? intersectionWidth : collisionPair.intersectionSizeY;
        collisionPair.intersectionSizeZ = (dimensionIndex == 2) ? intersectionWidth : collisionPair.intersectionSizeZ;

        collisionPair.intersectionCenterX = (dimensionIndex == 0) ? intersectionCenter : collisionPair.intersectionCenterX;
        collisionPair.intersectionCenterY = (dimensionIndex == 1) ? intersectionCenter : collisionPair.intersectionCenterY;
        collisionPair.intersectionCenterZ = (dimensionIndex == 2) ? intersectionCenter : collisionPair.intersectionCenterZ;
    }
}