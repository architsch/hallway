import { vec2, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;

export class DelayedSelfRemoverComponent extends Component
{
    delayDuration: number = undefined;

    // This one gets initialized by DelayedSelfRemoverSystem.
    startTime: number = undefined;

    applyDefaultValues()
    {
        this.delayDuration = 1;
        this.startTime = undefined;
    }
}
ComponentPools["DelayedSelfRemover"] = new Pool<DelayedSelfRemoverComponent>("DelayedSelfRemoverComponent", g.maxNumEntities, () => new DelayedSelfRemoverComponent());

//-----------------------------------------------------------------------

