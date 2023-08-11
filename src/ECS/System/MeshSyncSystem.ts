import { GlobalFunctions } from "../../GlobalFunctions";
import { MeshComponent, TransformComponent } from "../Component/Components";
import ECSManager from "../ECSManager";
import Entity from "../Entity/Entity";
import System from "./System";

export default class MeshSyncSystem extends System
{
    constructor()
    {
        super();
        this.requiredComponentTypes.add("Transform");
        this.requiredComponentTypes.add("Mesh");
    }

    update(ecs: ECSManager, t: number, dt: number)
    {
        this.entities.forEach((entity: Entity) => {
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            if (!transformComponent.syncedWithMesh)
            {
                const meshComponent = ecs.getComponent(entity.id, "Mesh") as MeshComponent;
                
                meshComponent.mesh.position.set(transformComponent.x, transformComponent.y, transformComponent.z);
                meshComponent.mesh.rotation.set(transformComponent.rotX, transformComponent.rotY, transformComponent.rotZ);
                meshComponent.mesh.scale.set(transformComponent.scaleX, transformComponent.scaleY, transformComponent.scaleZ);
                
                transformComponent.syncedWithMesh = true;
            }
        });
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
        const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
        const meshComponent = ecs.getComponent(entity.id, "Mesh") as MeshComponent;

        const mesh = GlobalFunctions.call("MeshManager::getMesh", meshComponent.meshId);
        meshComponent.mesh = mesh.clone();
        meshComponent.mesh.position.set(transformComponent.x, transformComponent.y, transformComponent.z);
        meshComponent.mesh.rotation.set(transformComponent.rotX, transformComponent.rotY, transformComponent.rotZ);
        meshComponent.mesh.scale.set(transformComponent.scaleX, transformComponent.scaleY, transformComponent.scaleZ);
        GlobalFunctions.call("SceneManager::addObject3D", meshComponent.mesh);

        transformComponent.syncedWithMesh = true;
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
        const meshComponent = ecs.getComponent(entity.id, "Mesh") as MeshComponent;
        GlobalFunctions.call("SceneManager::removeObject3D", meshComponent.mesh);
    }
}