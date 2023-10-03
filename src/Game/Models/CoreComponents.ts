import { vec2, vec3 } from "gl-matrix";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import { Component, registerComponent } from "../../ECS/Component";

const g = globalPropertiesConfig;

export class PlayerComponent extends Component
{
    applyDefaultValues()
    {
    }
}
registerComponent("PlayerComponent", () => new PlayerComponent());

//-----------------------------------------------------------------------