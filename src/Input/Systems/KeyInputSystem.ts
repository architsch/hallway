import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";

export default class KeyInputSystem extends System
{
    private entityIdByPressedKey: {[key: string]: number};

    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [];
    }

    start(ecs: ECSManager)
    {
        this.entityIdByPressedKey = {};

        window.addEventListener("keydown", (event: KeyboardEvent) =>
        {
            if (this.entityIdByPressedKey[event.key] != undefined)
                throw new Error(`Key is already pressed :: ${event.key}`);

            event.preventDefault();
            const entity = ecs.addEntity("empty");
            ecs.addComponent(entity.id, "KeyInput", {key: ["string", event.key]});
            this.entityIdByPressedKey[event.key] = entity.id;
        });

        window.addEventListener("keyup", (event: KeyboardEvent) =>
        {
            if (this.entityIdByPressedKey[event.key] == undefined)
                throw new Error(`Key is already unpressed :: ${event.key}`);

            event.preventDefault();
            ecs.removeEntity(this.entityIdByPressedKey[event.key]);
            delete this.entityIdByPressedKey[event.key];
        });

        const onFocusDisturbed = (_: any) =>
        {
            for (const entityId of Object.values(this.entityIdByPressedKey))
                ecs.removeEntity(entityId);
            this.entityIdByPressedKey = {};
        };
        window.addEventListener("focus", onFocusDisturbed);
        window.addEventListener("blur", onFocusDisturbed);
        window.addEventListener("focusin", onFocusDisturbed);
        window.addEventListener("focusout", onFocusDisturbed);
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