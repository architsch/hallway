import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { KinematicsComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { PathfinderComponent } from "../Models/AIComponents";

export default class PathfindingSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Pathfinder", ["Transform", "Kinematics", "Pathfinder"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const pathfinderEntities = this.queryEntityGroup("Pathfinder");

        pathfinderEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const kinematics = ecs.getComponent(entity.id, "Kinematics") as KinematicsComponent;
            const pathfinder = ecs.getComponent(entity.id, "Pathfinder") as PathfinderComponent;
        });
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}