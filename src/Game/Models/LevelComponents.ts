import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import { Component, registerComponent } from "../../ECS/Component";

const g = globalPropertiesConfig;

export class LevelComponent extends Component
{
    levelIndex: number = undefined;

    applyDefaultValues()
    {
        this.levelIndex = -1;
    }
}
registerComponent("LevelComponent", () => new LevelComponent());

//-----------------------------------------------------------------------

export class DontRemoveOnLevelChangeComponent extends Component
{
    applyDefaultValues()
    {
    }
}
registerComponent("DontRemoveOnLevelChangeComponent", () => new DontRemoveOnLevelChangeComponent());

//-----------------------------------------------------------------------

export class LevelPortalComponent extends Component
{
    newLevelIndex: number = undefined;

    applyDefaultValues()
    {
        this.newLevelIndex = -1;
    }
}
registerComponent("LevelPortalComponent", () => new LevelPortalComponent());

//-----------------------------------------------------------------------