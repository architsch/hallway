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
    applyDefaultValues()
    {    
    }
}
ComponentPools["Rigidbody"] = new Pool<RigidbodyComponent>("RigidbodyComponent", 256, () => new RigidbodyComponent());

//-----------------------------------------------------------------------