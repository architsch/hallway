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

export class StatsComponent extends Component
{
    level: number = undefined;

    applyDefaultValues()
    {
        this.level = -1;
    }
}
registerComponent("StatsComponent", () => new StatsComponent());

//-----------------------------------------------------------------------