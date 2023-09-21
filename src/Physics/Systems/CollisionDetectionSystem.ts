import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { ColliderComponent, CollisionEventComponent, TransformComponent } from "../Models/PhysicsComponents";
import { globalConfig } from "../../Config/GlobalConfig";
import { Component } from "../../ECS/Component";

export default class CollisionDetectionSystem extends System
{
    private worldBoundMinPadded: vec3 = vec3.create();
    private worldBoundSizePadded: vec3 = vec3.create();
    private worldSizeInVoxels: vec3 = vec3.fromValues(7, 3, 25);
    private entityIdsByVoxelCoords: number[][];
    private boundingBoxSizeHalf: vec3 = vec3.create();

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["CollisionEvent", ["CollisionEvent"]],
            ["Collider", ["Transform", "Collider"]],
        ];
    }

    start(ecs: ECSManager)
    {
        this.mark = this.mark.bind(this);
        this.detectCollision = this.detectCollision.bind(this);

        this.entityIdsByVoxelCoords = new Array<number[]>(this.worldSizeInVoxels[0] * this.worldSizeInVoxels[1] * this.worldSizeInVoxels[2]);
        for (let i = 0; i < this.entityIdsByVoxelCoords.length; ++i)
            this.entityIdsByVoxelCoords[i] = [];

        const g = globalConfig.globalPropertiesConfig;
        const padding = 5;
        const paddingVec = vec3.fromValues(padding, padding, padding);
        vec3.subtract(this.worldBoundMinPadded, g.worldBoundMin, paddingVec);
        vec3.add(this.worldBoundSizePadded, g.worldBoundSize, paddingVec);
        vec3.add(this.worldBoundSizePadded, this.worldBoundSizePadded, paddingVec);
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        // Clean up the voxels before marking them with entityIds.
        for (const entityIds of this.entityIdsByVoxelCoords)
            entityIds.length = 0;

        const eventEntities = this.queryEntityGroup("CollisionEvent");
        
        // Clean up previously detected collisions before raising new ones.
        eventEntities.forEach((eventEntity: Entity) => {
            ecs.removeEntity(eventEntity.id);
        });
        ecs.clearRemovePendingEntities();

        const colliderEntities = this.queryEntityGroup("Collider");

        // Calculate bounding-box dimensions, and mark their overlapping voxels.
        colliderEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const collider = ecs.getComponent(entity.id, "Collider") as ColliderComponent;
            collider.currentCollidingEntityIds.length = 0;
    
            vec3.scale(this.boundingBoxSizeHalf, collider.boundingBoxSize, 0.5);
            vec3.subtract(collider.boundingBoxMin, tr.position, this.boundingBoxSizeHalf);
            vec3.add(collider.boundingBoxMax, tr.position, this.boundingBoxSizeHalf);
    
            vec3.set(collider.boundingBoxVoxelCoordsMin,
                Math.floor(this.worldSizeInVoxels[0] * (collider.boundingBoxMin[0] - this.worldBoundMinPadded[0]) / this.worldBoundSizePadded[0]),
                Math.floor(this.worldSizeInVoxels[1] * (collider.boundingBoxMin[1] - this.worldBoundMinPadded[1]) / this.worldBoundSizePadded[1]),
                Math.floor(this.worldSizeInVoxels[2] * (collider.boundingBoxMin[2] - this.worldBoundMinPadded[2]) / this.worldBoundSizePadded[2])
            );
            vec3.set(collider.boundingBoxVoxelCoordsMax,
                Math.floor(this.worldSizeInVoxels[0] * (collider.boundingBoxMax[0] - this.worldBoundMinPadded[0]) / this.worldBoundSizePadded[0]),
                Math.floor(this.worldSizeInVoxels[1] * (collider.boundingBoxMax[1] - this.worldBoundMinPadded[1]) / this.worldBoundSizePadded[1]),
                Math.floor(this.worldSizeInVoxels[2] * (collider.boundingBoxMax[2] - this.worldBoundMinPadded[2]) / this.worldBoundSizePadded[2])
            );
            this.forEachVoxel(ecs, t, dt, entity, this.mark);
        });

        // Register collision events.
        colliderEntities.forEach((entity: Entity) => {
            this.forEachVoxel(ecs, t, dt, entity, this.detectCollision);
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }

    private forEachVoxel(ecs: ECSManager, t: number, dt: number, entity: Entity,
        functionToRun: (ecs: ECSManager, t: number, dt: number, entity: Entity, voxelEntityIds: number[]) => void)
    {
        const collider = ecs.getComponent(entity.id, "Collider") as ColliderComponent;

        const coordsMin = collider.boundingBoxVoxelCoordsMin;
        const coordsMax = collider.boundingBoxVoxelCoordsMax;

        const coordsX1 = Math.max(0, coordsMin[0]);
        const coordsX2 = Math.min(this.worldSizeInVoxels[0]-1, coordsMax[0]);
        const coordsY1 = Math.max(0, coordsMin[1]);
        const coordsY2 = Math.min(this.worldSizeInVoxels[1]-1, coordsMax[1]);
        const coordsZ1 = Math.max(0, coordsMin[2]);
        const coordsZ2 = Math.min(this.worldSizeInVoxels[2]-1, coordsMax[2]);

        for (let voxelX = coordsX1; voxelX <= coordsX2; ++voxelX)
        {
            for (let voxelY = coordsY1; voxelY <= coordsY2; ++voxelY)
            {
                for (let voxelZ = coordsZ1; voxelZ <= coordsZ2; ++voxelZ)
                {
                    const index = voxelX + this.worldSizeInVoxels[0]*voxelY + this.worldSizeInVoxels[0]*this.worldSizeInVoxels[1]*voxelZ;
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
        const c1 = ecs.getComponent(myEntity.id, "Collider") as ColliderComponent;

        if (c1.activelyDetectCollisions)
        {
            for (const otherEntityId of voxelEntityIds)
            {
                if (otherEntityId != myEntity.id)
                {
                    const c2 = ecs.getComponent(otherEntityId, "Collider") as ColliderComponent;

                    if (c1.currentCollidingEntityIds.indexOf(otherEntityId) < 0)
                    {
                        const xOverlap = c1.boundingBoxMin[0] <= c2.boundingBoxMax[0] && c1.boundingBoxMax[0] >= c2.boundingBoxMin[0];
                        const yOverlap = c1.boundingBoxMin[1] <= c2.boundingBoxMax[1] && c1.boundingBoxMax[1] >= c2.boundingBoxMin[1];
                        const zOverlap = c1.boundingBoxMin[2] <= c2.boundingBoxMax[2] && c1.boundingBoxMax[2] >= c2.boundingBoxMin[2];

                        if (xOverlap && yOverlap && zOverlap) // These two entities are colliding with each other.
                        {
                            const eventEntity = ecs.addEntity("empty");
                            const event = ecs.addComponent(eventEntity.id, "CollisionEvent") as CollisionEventComponent;
                            event.entityId1 = myEntity.id;
                            event.entityId2 = otherEntityId;

                            this.updateIntersectionStatus(event, c1, c2, 0);
                            this.updateIntersectionStatus(event, c1, c2, 1);
                            this.updateIntersectionStatus(event, c1, c2, 2);
                            
                            c2.currentCollidingEntityIds.push(myEntity.id);
                            c1.currentCollidingEntityIds.push(otherEntityId);
                        }
                    }
                }
            }
        }
    }

    // (The given two colliders, c1 and c2, must be overlapping)
    private updateIntersectionStatus(event: CollisionEventComponent, c1: ColliderComponent, c2: ColliderComponent, dimensionIndex: number)
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

        vec3.set(event.intersectionSize,
            (dimensionIndex == 0) ? intersectionWidth : event.intersectionSize[0],
            (dimensionIndex == 1) ? intersectionWidth : event.intersectionSize[1],
            (dimensionIndex == 2) ? intersectionWidth : event.intersectionSize[2]
        );
        vec3.set(event.intersectionCenter,
            (dimensionIndex == 0) ? intersectionCenter : event.intersectionCenter[0],
            (dimensionIndex == 1) ? intersectionCenter : event.intersectionCenter[1],
            (dimensionIndex == 2) ? intersectionCenter : event.intersectionCenter[2]
        );
    }
}