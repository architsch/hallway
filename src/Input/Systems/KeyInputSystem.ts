import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { KeyInputComponent } from "../Models/InputComponents";

export default class KeyInputSystem extends System
{
    private entityIdByPressedKey: {[key: string]: number};

    protected getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [];
    }

    start(ecs: ECSManager)
    {
        this.entityIdByPressedKey = {};

        window.addEventListener("keydown", (event: KeyboardEvent) =>
        {
            event.preventDefault();

            if (this.entityIdByPressedKey[event.key] == undefined)
            {
                const entity = ecs.addEntity("empty");
                const component = ecs.addComponent(entity.id, "KeyInputComponent") as KeyInputComponent;
                component.key = event.key;
                this.entityIdByPressedKey[event.key] = entity.id;
            }
        });

        window.addEventListener("keyup", (event: KeyboardEvent) =>
        {
            event.preventDefault();

            if (this.entityIdByPressedKey[event.key] != undefined)
            {
                ecs.removeEntity(this.entityIdByPressedKey[event.key]);
                delete this.entityIdByPressedKey[event.key];
            }
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

    protected onEntityRegistered(ecs: ECSManager, entity: Entity)
    {
    }

    protected onEntityUnregistered(ecs: ECSManager, entity: Entity)
    {
    }
}