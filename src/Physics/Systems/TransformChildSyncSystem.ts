import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { TransformChildComponent, TransformComponent } from "../Models/PhysicsComponents";

export default class TransformChildSyncSystem extends System
{
    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["TransformChildComponent", ["TransformChildComponent", "TransformComponent"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const entities = this.queryEntityGroup("TransformChildComponent");

        entities.forEach((entity: Entity) => {
            const child = ecs.getComponent(entity.id, "TransformChildComponent") as TransformChildComponent;

            if (child.parentEntityId >= 0) // I have a parent (-1 means there is no parent)
            {
                if (ecs.getEntity(child.parentEntityId).alive)
                {
                    const childTr = ecs.getComponent(entity.id, "TransformComponent") as TransformComponent;
                    const parentTr = ecs.getComponent(child.parentEntityId, "TransformComponent") as TransformComponent;
                    const p1 = childTr.position;
                    const p2 = parentTr.position;
                    const r1 = childTr.rotation;
                    const r2 = parentTr.rotation;
                    const s1 = childTr.scale;
                    const s2 = parentTr.scale;
                    const pChanged = p1[0] != p2[0] || p1[1] != p2[1] || p1[2] != p2[2];
                    const rChanged = r1[0] != r2[0] || r1[1] != r2[1] || r1[2] != r2[2];
                    const sChanged = s1[0] != s2[0] || s1[1] != s2[1] || s1[2] != s2[2];

                    if (pChanged)
                        vec3.copy(childTr.position, parentTr.position);
                    if (rChanged)
                        vec3.copy(childTr.rotation, parentTr.rotation);
                    if (sChanged)
                        vec3.copy(childTr.scale, parentTr.scale);
                
                    if (pChanged || rChanged || sChanged)
                        childTr.matrixSynced = false;
                }
                else // Parent has been removed, so let's remove myself as well because I depend on it.
                {
                    ecs.removeEntity(entity.id);
                }
            }
            else
                throw new Error(`No valid parent ID found in TransformChildComponent (parentEntityId = ${child.parentEntityId})`);
        });
    }

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}