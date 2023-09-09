import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { RigidbodyComponent, TransformComponent } from "../Models/PhysicsComponents";
import { globalConfig } from "../../Config/GlobalConfig";

export default class CollisionSystem extends System
{
    private worldSizeInVoxels: vec3 = vec3.fromValues(5, 1, 20);
    private entityIdsByVoxelCoords: number[][];

    private push: vec3 = vec3.create();
    private pushExtraUp: vec3 = vec3.fromValues(0, 10, 0);

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Rigidbody", ["Transform", "Rigidbody"]],
        ];
    }

    start(ecs: ECSManager)
    {
        this.mark = this.mark.bind(this);
        this.detectCollision = this.detectCollision.bind(this);

        this.entityIdsByVoxelCoords = new Array<number[]>(this.worldSizeInVoxels[0] * this.worldSizeInVoxels[1] * this.worldSizeInVoxels[2]);
        for (let i = 0; i < this.entityIdsByVoxelCoords.length; ++i)
            this.entityIdsByVoxelCoords[i] = [];
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const g = globalConfig.globalPropertiesConfig;

        for (const entityIds of this.entityIdsByVoxelCoords)
            entityIds.length = 0;

        const rigidbodyEntities = this.entityGroups["Rigidbody"];

        rigidbodyEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const rb = ecs.getComponent(entity.id, "Rigidbody") as RigidbodyComponent;

            this.processWorldBoundCollision(tr, rb, 0);
            this.processWorldBoundCollision(tr, rb, 1);
            this.processWorldBoundCollision(tr, rb, 2);
    
            vec3.scale(rb.boundingBoxMin, rb.hitboxSize, 0.5);
            vec3.subtract(rb.boundingBoxMin, tr.position, rb.boundingBoxMin);
    
            vec3.scale(rb.boundingBoxMax, rb.hitboxSize, 0.5);
            vec3.add(rb.boundingBoxMax, tr.position, rb.boundingBoxMax);
    
            vec3.set(rb.boundingBoxVoxelCoordsMin,
                Math.floor(this.worldSizeInVoxels[0] * (rb.boundingBoxMin[0] - g.worldBoundMin[0]) / g.worldBoundSize[0]),
                Math.floor(this.worldSizeInVoxels[1] * (rb.boundingBoxMin[1] - g.worldBoundMin[1]) / g.worldBoundSize[1]),
                Math.floor(this.worldSizeInVoxels[2] * (rb.boundingBoxMin[2] - g.worldBoundMin[2]) / g.worldBoundSize[2])
            );
            vec3.set(rb.boundingBoxVoxelCoordsMax,
                Math.floor(this.worldSizeInVoxels[0] * (rb.boundingBoxMax[0] - g.worldBoundMin[0]) / g.worldBoundSize[0]),
                Math.floor(this.worldSizeInVoxels[1] * (rb.boundingBoxMax[1] - g.worldBoundMin[1]) / g.worldBoundSize[1]),
                Math.floor(this.worldSizeInVoxels[2] * (rb.boundingBoxMax[2] - g.worldBoundMin[2]) / g.worldBoundSize[2])
            );
            this.forEachVoxel(ecs, t, dt, entity, this.mark);
        });

        rigidbodyEntities.forEach((entity: Entity) => {
            this.forEachVoxel(ecs, t, dt, entity, this.detectCollision);
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }

    private forEachVoxel(ecs: ECSManager, t: number, dt: number, entity: Entity,
        functionToRun: (ecs: ECSManager, t: number, dt: number, entity: Entity, voxelEntityIds: number[]) => void)
    {
        const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
        const rb = ecs.getComponent(entity.id, "Rigidbody") as RigidbodyComponent;

        const coordsMin = rb.boundingBoxVoxelCoordsMin;
        const coordsMax = rb.boundingBoxVoxelCoordsMax;

        for (let voxelX = coordsMin[0]; voxelX <= coordsMax[0]; ++voxelX)
        {
            for (let voxelY = coordsMin[1]; voxelY <= coordsMax[1]; ++voxelY)
            {
                for (let voxelZ = coordsMin[2]; voxelZ <= coordsMax[2]; ++voxelZ)
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

    private detectCollision(ecs: ECSManager, t: number, dt: number, entity: Entity, voxelEntityIds: number[])
    {
        const tr1 = ecs.getComponent(entity.id, "Transform") as TransformComponent;
        const r1 = ecs.getComponent(entity.id, "Rigidbody") as RigidbodyComponent;

        for (const entityId of voxelEntityIds)
        {
            if (entityId != entity.id)
            {
                const r2 = ecs.getComponent(entityId, "Rigidbody") as RigidbodyComponent;
                const xOverlap = r1.boundingBoxMin[0] < r2.boundingBoxMax[0] && r1.boundingBoxMax[0] > r2.boundingBoxMin[0];
                const yOverlap = r1.boundingBoxMin[1] < r2.boundingBoxMax[1] && r1.boundingBoxMax[1] > r2.boundingBoxMin[1];
                const zOverlap = r1.boundingBoxMin[2] < r2.boundingBoxMax[2] && r1.boundingBoxMax[2] > r2.boundingBoxMin[2];

                if (xOverlap && yOverlap && zOverlap) // These two entities are colliding with each other.
                {
                    const tr2 = ecs.getComponent(entityId, "Transform") as TransformComponent;
                    vec3.subtract(this.push, tr1.position, tr2.position);
                    vec3.normalize(this.push, this.push);
                    vec3.scale(this.push, this.push, 10 * r1.elasticity);
                    vec3.add(this.push, this.push, this.pushExtraUp);
                    vec3.add(r1.force, r1.force, this.push);
                }
            }
        }
    }

    private reflect(v: vec3, normal: vec3, attenuationFactor: number)
    {
        const dot = vec3.dot(v, normal);
        vec3.set(v,
            v[0] - 2 * dot * normal[0],
            v[1] - 2 * dot * normal[1],
            v[2] - 2 * dot * normal[2]);
        vec3.scale(v, v, attenuationFactor);
    }

    private processWorldBoundCollision(tr: TransformComponent, rb: RigidbodyComponent, voxelCoordIndex: number)
    {
        const g = globalConfig.globalPropertiesConfig;
        let adjustedPositionCoord: number | undefined = undefined;

        if (tr.position[voxelCoordIndex] - 0.5*rb.hitboxSize[voxelCoordIndex] <= g.worldBoundMin[voxelCoordIndex] + 0.001)
        {
            adjustedPositionCoord = g.worldBoundMin[voxelCoordIndex] + 0.5*rb.hitboxSize[voxelCoordIndex] + 0.001;
            if (rb.velocity[voxelCoordIndex] < 0)
                this.reflect(rb.velocity, g.worldBoundNormals[voxelCoordIndex][0], rb.elasticity);
            if (rb.force[voxelCoordIndex] < 0)
                this.reflect(rb.force, g.worldBoundNormals[voxelCoordIndex][0], rb.elasticity);
        }
        if (tr.position[voxelCoordIndex] + 0.5*rb.hitboxSize[voxelCoordIndex] >= g.worldBoundMax[voxelCoordIndex] - 0.001)
        {
            adjustedPositionCoord = g.worldBoundMax[voxelCoordIndex] - 0.5*rb.hitboxSize[voxelCoordIndex] - 0.001;
            if (rb.velocity[voxelCoordIndex] > 0)
                this.reflect(rb.velocity, g.worldBoundNormals[voxelCoordIndex][1], rb.elasticity);
            if (rb.force[voxelCoordIndex] > 0)
                this.reflect(rb.force, g.worldBoundNormals[voxelCoordIndex][1], rb.elasticity);
        }

        if (adjustedPositionCoord != undefined)
        {
            vec3.set(tr.position,
                (voxelCoordIndex == 0) ? adjustedPositionCoord : tr.position[0],
                (voxelCoordIndex == 1) ? adjustedPositionCoord : tr.position[1],
                (voxelCoordIndex == 2) ? adjustedPositionCoord : tr.position[2]);
        }
    }
}