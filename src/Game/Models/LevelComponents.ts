import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";

const g = globalPropertiesConfig;

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

export class DontDisplaceOnLevelChangeComponent extends Component
{
    applyDefaultValues()
    {
    }
}
ComponentPools["DontDisplaceOnLevelChange"] = new Pool<DontDisplaceOnLevelChangeComponent>("DontDisplaceOnLevelChangeComponent", 16, () => new DontDisplaceOnLevelChangeComponent());

//-----------------------------------------------------------------------

export class LevelPortalComponent extends Component
{
    newLevelIndex: number = undefined;

    applyDefaultValues()
    {
        this.newLevelIndex = -1;
    }
}
ComponentPools["LevelPortal"] = new Pool<LevelPortalComponent>("LevelPortalComponent", g.estimatedMaxCollisionsPerEntity, () => new LevelPortalComponent());

//-----------------------------------------------------------------------