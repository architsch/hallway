import { TransformComponent } from "../Component/Components";
import ECSManager from "../ECSManager";
import Entity from "../Entity/Entity";
import System from "./System";

export default class TransformUpdateSystem extends System
{
    constructor()
    {
        super();
        this.requiredComponentTypes.add("Transform");
    }

    update(ecs: ECSManager, t: number, dt: number)
    {
        this.entities.forEach((entity: Entity) => {
            const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;

            transformComponent.x = Math.cos(entity.id * 0.25*Math.PI + 2*t);
            transformComponent.x = Math.sin(entity.id * 0.25*Math.PI + 2*t);
            transformComponent.z = 0;

            transformComponent.rotX = Math.sin(entity.id * 0.2*Math.PI + t);
            transformComponent.rotY = Math.sin(entity.id * 0.23*Math.PI + 1.25*t);
            transformComponent.rotZ = Math.sin(entity.id * 0.26*Math.PI + 1.5*t);

            transformComponent.syncedWithMesh = false;
        });
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}