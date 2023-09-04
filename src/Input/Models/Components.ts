import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";

export interface KeyInputComponent extends Component
{
    key: string;
}
ComponentPools["KeyInput"] = new Pool<KeyInputComponent>(64, () => { return {
    id: undefined,
    entityId: undefined,
    key: undefined,
};});

//-----------------------------------------------------------------------