import { vec3 } from "gl-matrix";
import ECSManager from "./ECSManager";
import { TransformComponent } from "../Physics/Models/Components";

export default class EntityFactory
{
    static addTripleCube(ecs: ECSManager,
        positionX: number, positionY: number, positionZ: number,
        rotationX: number, rotationY: number, rotationZ: number,
        scaleX: number, scaleY: number, scaleZ: number)
    {
        const parentCube = ecs.addEntity("cube");
        ecs.addComponent(parentCube.id, "Rigidbody", {});

        const childCube1 = ecs.addEntity("cube");
        ecs.setParent(childCube1, parentCube);

        const childCube2 = ecs.addEntity("cube");
        ecs.setParent(childCube2, parentCube);

        let transformComponent = ecs.getComponent(parentCube.id, "Transform") as TransformComponent;
        vec3.set(transformComponent.position, positionX, positionY, positionZ);
        vec3.set(transformComponent.rotation, rotationX, rotationY, rotationZ);
        vec3.set(transformComponent.scale, scaleX, scaleY, scaleZ);
        
        transformComponent = ecs.getComponent(childCube1.id, "Transform") as TransformComponent;
        vec3.set(transformComponent.position, -0.6, 0.6, 0);
        vec3.set(transformComponent.rotation, 0, 0, 0);
        vec3.set(transformComponent.scale, 0.5, 0.5, 0.5);
        
        transformComponent = ecs.getComponent(childCube2.id, "Transform") as TransformComponent;
        vec3.set(transformComponent.position, +0.6, 0.6, 0);
        vec3.set(transformComponent.rotation, 0, 0, 0);
        vec3.set(transformComponent.scale, 0.5, 0.5, 0.5);
    }
}