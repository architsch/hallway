import { vec2, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;

export abstract class CollisionEventAttribComponent extends Component
{
    isCollisionEventAttribComponent: boolean = true;
    attribOwnershipType: "entity1" | "entity2" | "both";
}

//-----------------------------------------------------------------------

export class PlayerComponent extends CollisionEventAttribComponent
{
    applyDefaultValues()
    {
    }
}
ComponentPools["Player"] = new Pool<PlayerComponent>("PlayerComponent", g.estimatedMaxCollisionsPerEntity, () => new PlayerComponent());

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

export class LevelPortalComponent extends CollisionEventAttribComponent
{
    newLevelIndex: number = undefined;

    applyDefaultValues()
    {
        this.newLevelIndex = -1;
    }
}
ComponentPools["LevelPortal"] = new Pool<LevelPortalComponent>("LevelPortalComponent", g.estimatedMaxCollisionsPerEntity, () => new LevelPortalComponent());

//-----------------------------------------------------------------------

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