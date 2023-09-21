import { vec2, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;

export class PlayerComponent extends Component
{
    applyDefaultValues()
    {
    }
}
ComponentPools["Player"] = new Pool<PlayerComponent>("PlayerComponent", g.estimatedMaxCollisionsPerEntity, () => new PlayerComponent());

//-----------------------------------------------------------------------