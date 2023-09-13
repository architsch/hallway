import { mat4, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;

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
ComponentPools["Transform"] = new Pool<TransformComponent>("TransformComponent", g.maxNumEntities, () => new TransformComponent());

//-----------------------------------------------------------------------

export class KinematicsComponent extends Component
{
    mass: number = undefined;
    decelerationRate: number = undefined;
    velocity: vec3 = vec3.create();
    force: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.mass = 1;
        this.decelerationRate = 1;
        vec3.set(this.velocity, 0, 0, 0);
        vec3.set(this.force, 0, 0, 0);
    }
}
ComponentPools["Kinematics"] = new Pool<KinematicsComponent>("KinematicsComponent", g.maxNumEntities, () => new KinematicsComponent());

//-----------------------------------------------------------------------

export class RigidbodyComponent extends Component
{
    elasticity: number = undefined;

    applyDefaultValues()
    {
        this.elasticity = 1;
    }
}
ComponentPools["Rigidbody"] = new Pool<RigidbodyComponent>("RigidbodyComponent", g.maxNumEntities, () => new RigidbodyComponent());

//-----------------------------------------------------------------------

export class SoftbodyComponent extends Component
{
    rigidity: number = undefined;

    applyDefaultValues()
    {
        this.rigidity = 1;
    }
}
ComponentPools["Softbody"] = new Pool<SoftbodyComponent>("SoftbodyComponent", g.maxNumEntities, () => new SoftbodyComponent());

//-----------------------------------------------------------------------

export class ColliderComponent extends Component
{
    activelyDetectCollisions: boolean = undefined;
    boundingBoxSize: vec3 = vec3.create();

    // Temporary info storage for collision detection
    boundingBoxMin: vec3 = vec3.create();
    boundingBoxMax: vec3 = vec3.create();
    boundingBoxVoxelCoordsMin: vec3 = vec3.create();
    boundingBoxVoxelCoordsMax: vec3 = vec3.create();
    currentCollidingEntityIds: Array<number> = new Array<number>(8);

    applyDefaultValues()
    {
        this.activelyDetectCollisions = true;
        vec3.set(this.boundingBoxSize, 1, 1, 1);
    }
}
ComponentPools["Collider"] = new Pool<ColliderComponent>("ColliderComponent", g.maxNumEntities, () => new ColliderComponent());

//-----------------------------------------------------------------------

export class CollisionEventComponent extends Component
{
    entityId1: number = undefined;
    entityId2: number = undefined;
    intersectionSize: vec3 = vec3.create();
    intersectionCenter: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.entityId1 = undefined;
        this.entityId2 = undefined;
    }
}
ComponentPools["CollisionEvent"] = new Pool<CollisionEventComponent>("CollisionEventComponent", g.maxNumEntities, () => new CollisionEventComponent());

//-----------------------------------------------------------------------