import { mat4, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";

export class TransformComponent extends Component
{
    position: vec3 = vec3.create();
    rotation: vec3 = vec3.create();
    scale: vec3 = vec3.create();
    
    localMat: mat4 = mat4.create();
    worldMat: mat4 = mat4.create();
    matrixSynced: boolean = undefined;

    applyDefaultValues()
    {
        vec3.set(this.position, 0, 0, 0);
        vec3.set(this.rotation, 0, 0, 0);
        vec3.set(this.scale, 1, 1, 1);

        mat4.identity(this.localMat);
        mat4.identity(this.worldMat);
        this.matrixSynced = false;
    }
}
ComponentPools["Transform"] = new Pool<TransformComponent>("TransformComponent", 256, () => new TransformComponent());

//-----------------------------------------------------------------------

export class RigidbodyComponent extends Component
{
    mass: number = undefined;
    elasticity: number = undefined;
    rigidity: number = undefined;
    decelerationRate: number = undefined;
    velocity: vec3 = vec3.create();
    force: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.mass = 1;
        this.elasticity = 1;
        this.rigidity = 1;
        this.decelerationRate = 1;
        vec3.set(this.velocity, 0, 0, 0);
        vec3.set(this.force, 0, 0, 0);
    }
}
ComponentPools["Rigidbody"] = new Pool<RigidbodyComponent>("RigidbodyComponent", 256, () => new RigidbodyComponent());

//-----------------------------------------------------------------------

export class ColliderComponent extends Component
{
    boundingBoxSize: vec3 = vec3.create();

    // Temporary info storage for collision detection
    boundingBoxMin: vec3 = vec3.create();
    boundingBoxMax: vec3 = vec3.create();
    boundingBoxVoxelCoordsMin: vec3 = vec3.create();
    boundingBoxVoxelCoordsMax: vec3 = vec3.create();
    currentCollidingEntityIds: Array<number> = new Array<number>(8);

    applyDefaultValues()
    {
        vec3.set(this.boundingBoxSize, 1, 1, 1);
    }
}
ComponentPools["Collider"] = new Pool<ColliderComponent>("ColliderComponent", 256, () => new ColliderComponent());

//-----------------------------------------------------------------------

export class CollisionEventComponent extends Component
{
    entityId1: number = undefined;
    entityId2: number = undefined;
    intersectionVolume: number = undefined;
    intersectionCenter: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.entityId1 = undefined;
        this.entityId2 = undefined;
        this.intersectionVolume = undefined;
    }
}
ComponentPools["CollisionEvent"] = new Pool<CollisionEventComponent>("CollisionEventComponent", 1024, () => new CollisionEventComponent());

//-----------------------------------------------------------------------