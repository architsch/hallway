import { vec3 } from "gl-matrix";
import { TransformComponent } from "../ECS/Components";
import ECSManager from "../ECS/ECSManager";
import Entity from "../ECS/Entity";
import System from "../ECS/System";
import { SystemGateway } from "../ECS/SystemGateway";

export default class KinematicsManager
{
    constructor()
    {
        //------------------------------------------------------------------------------
        // Test transform update system
        //------------------------------------------------------------------------------

        const system = new System();
        system.requiredComponentTypes.add("Transform");

        system.update = (ecs: ECSManager, t: number, dt: number) => {
            system.entities.forEach((entity: Entity) => {
                const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;

                vec3.set(transformComponent.position,
                    3 * Math.cos(entity.id * 0.25*Math.PI + t),
                    3 * Math.sin(entity.id * 0.25*Math.PI + t),
                    0);
                
                transformComponent.angleZ = entity.id * 0.2*Math.PI + t;
                
                transformComponent.syncedWithMesh = false;
            });
        };

        system.onEntityRegistered = (ecs: ECSManager, entity: Entity) => {
        };

        system.onEntityUnregistered = (ecs: ECSManager, entity: Entity) => {
        };

        SystemGateway.push(system);
    }

    update(t: number, dt: number)
    {
        ;
    }
}