import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import EntityFactory from "../../ECS/EntityFactory";
import System from "../../ECS/System";

export default class GameInitSystem extends System
{
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [];
    }

    start(ecs: ECSManager)
    {
        ecs.addEntity("mainCamera");
        ecs.addEntity("mainLight");

        for (let i = 0; i < 8; ++i)
        {
            EntityFactory.addTripleCube(ecs, 0, 0, 0, 0, 0, 0, 1, 1, 1);
        }

        const s = 0.0625;

        for (let z = 0; z <= 2; ++z)
        {
            EntityFactory.addFloor(ecs, z, s, s, 14*s, 8*s);
            EntityFactory.addCeiling(ecs, z, s, s, 11*s, 8*s);
            EntityFactory.addLeftWall(ecs, z, s, s, 13*s, 8*s);
            EntityFactory.addRightWall(ecs, z, s, s, 13*s, 8*s);
        }
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}