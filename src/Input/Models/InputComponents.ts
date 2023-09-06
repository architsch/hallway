import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";

export class KeyInputComponent extends Component
{
    key: string = undefined;

    applyDefaultValues()
    {
        this.key = undefined;
    }
}
ComponentPools["KeyInput"] = new Pool<KeyInputComponent>("KeyInputComponent", 64, () => new KeyInputComponent());

//-----------------------------------------------------------------------