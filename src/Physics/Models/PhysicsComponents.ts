import { mat4, vec3 } from "gl-matrix";
import { Component, registerComponent } from "../../ECS/Component";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import { CollisionPair, CollisionPairPool } from "./CollisionPair";

const g = globalPropertiesConfig;

export class TransformComponent extends Component
{
    position: vec3 = vec3.create();
    rotation: vec3 = vec3.create();
    scale: vec3 = vec3.create();
    
    worldMat: mat4 = mat4.create();
    matrixSynced: boolean = undefined;

    applyDefaultValues()
    {
        vec3.set(this.position, 0, 0, 0);
        vec3.set(this.rotation, 0, 0, 0);
        vec3.set(this.scale, 1, 1, 1);

        mat4.identity(this.worldMat);
        this.matrixSynced = false;
    }
}
registerComponent("TransformComponent", () => new TransformComponent());

//-----------------------------------------------------------------------

export class TransformChildComponent extends Component
{
    parentEntityId: number = undefined; // -1 if there is no parent

    applyDefaultValues()
    {
        this.parentEntityId = -1;
    }
}
registerComponent("TransformChildComponent", () => new TransformChildComponent());

//-----------------------------------------------------------------------

export class KinematicsComponent extends Component
{
    mass: number = undefined;
    decelerationRate: number = undefined;
    gravityMultiplier: number = undefined;

    // State
    velocity: vec3 = vec3.create();
    pendingForce: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.mass = 1;
        this.decelerationRate = 3;
        this.gravityMultiplier = 1;
        vec3.set(this.velocity, 0, 0, 0);
        vec3.set(this.pendingForce, 0, 0, 0);
    }
}
registerComponent("KinematicsComponent", () => new KinematicsComponent());

//-----------------------------------------------------------------------

export class ColliderComponent extends Component
{
    detectCollisions: boolean = undefined;
    boundingBoxSize: vec3 = vec3.create();

    // Temporary info storage for collision detection
    boundingBoxMin: vec3 = vec3.create();
    boundingBoxMax: vec3 = vec3.create();
    boundingBoxVoxelCoordsMin: vec3 = vec3.create();
    boundingBoxVoxelCoordsMax: vec3 = vec3.create();

    applyDefaultValues()
    {
        this.detectCollisions = true;
        vec3.set(this.boundingBoxSize, 1, 1, 1);
    }
}
registerComponent("ColliderComponent", () => new ColliderComponent());

//-----------------------------------------------------------------------

export class CollisionEventComponent extends Component
{
    // State
    collisionPairs: Array<CollisionPair> = new Array<CollisionPair>(4).fill(undefined);

    applyDefaultValues()
    {
        for (let i = 0; i < this.collisionPairs.length; ++i)
        {
            if (this.collisionPairs[i] != undefined)
                CollisionPairPool.return(this.collisionPairs[i].id);
        }
        this.collisionPairs.length = 0;
    }
}
registerComponent("CollisionEventComponent", () => new CollisionEventComponent());

//-----------------------------------------------------------------------

export class RigidbodyComponent extends Component
{
    softSurfaceDepth: number = undefined;
    elasticity: number = undefined;
    rigidity: number = undefined;

    applyDefaultValues()
    {
        this.softSurfaceDepth = 0;
        this.elasticity = 1;
        this.rigidity = 1;
    }
}
registerComponent("RigidbodyComponent", () => new RigidbodyComponent());

//-----------------------------------------------------------------------

export class ConstantForceFieldComponent extends Component
{
    force: vec3 = vec3.create();

    applyDefaultValues()
    {
        vec3.set(this.force, 0, 0, 0);
    }
}
registerComponent("ConstantForceFieldComponent", () => new ConstantForceFieldComponent());

//-----------------------------------------------------------------------

export class RadialForceFieldComponent extends Component
{
    forceIntensity: number = undefined;
    forceFalloffStartRadius: number = undefined;
    forceFalloffEndRadius: number = undefined;

    applyDefaultValues()
    {
        this.forceIntensity = 10;
        this.forceFalloffStartRadius = 3;
        this.forceFalloffEndRadius = 6;
    }
}
registerComponent("RadialForceFieldComponent", () => new RadialForceFieldComponent());

//-----------------------------------------------------------------------