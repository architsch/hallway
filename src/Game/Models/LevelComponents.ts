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

export class LevelMemberComponent extends Component
{
    levelIndex: number = undefined;

    applyDefaultValues()
    {
        this.levelIndex = -1;
    }
}
registerComponent("LevelMemberComponent", () => new LevelMemberComponent());

//-----------------------------------------------------------------------

export class DontDisplaceOnLevelChangeComponent extends Component
{
    applyDefaultValues()
    {
    }
}
registerComponent("DontDisplaceOnLevelChangeComponent", () => new DontDisplaceOnLevelChangeComponent());

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

export class BackWallComponent extends Component
{
    applyDefaultValues()
    {
    }
}
registerComponent("BackWallComponent", () => new BackWallComponent());

//-----------------------------------------------------------------------