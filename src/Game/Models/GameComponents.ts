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
ComponentPools["Player"] = new Pool<PlayerComponent>("PlayerComponent", 1, () => new PlayerComponent());

//-----------------------------------------------------------------------

export class LevelComponent extends Component
{
    levelIndex: number = undefined;

    applyDefaultValues()
    {
        this.levelIndex = -1;
    }
}
ComponentPools["Level"] = new Pool<LevelComponent>("LevelComponent", 1, () => new LevelComponent());

//-----------------------------------------------------------------------

export class LevelChangeSignalComponent extends Component
{
    newLevelIndex: number = undefined;

    applyDefaultValues()
    {
        this.newLevelIndex = -1;
    }
}
ComponentPools["Level"] = new Pool<LevelComponent>("LevelComponent", 32, () => new LevelComponent());

//-----------------------------------------------------------------------

export class LevelMemberComponent extends Component
{
    levelIndex: number = undefined;
    carryoverPending: boolean = undefined;

    applyDefaultValues()
    {
        this.levelIndex = -1;
        this.carryoverPending = false;
    }
}
ComponentPools["LevelMember"] = new Pool<LevelMemberComponent>("LevelMemberComponent", g.maxNumEntities, () => new LevelMemberComponent());

//-----------------------------------------------------------------------