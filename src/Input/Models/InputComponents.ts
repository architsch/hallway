import { Component, registerComponent } from "../../ECS/Component";

export class KeyInputComponent extends Component
{
    key: string = undefined;

    applyDefaultValues()
    {
        this.key = undefined;
    }
}
registerComponent("KeyInputComponent", () => new KeyInputComponent());

//-----------------------------------------------------------------------