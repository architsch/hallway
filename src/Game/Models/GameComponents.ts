import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";

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
    applyDefaultValues()
    {
    }
}
ComponentPools["Level"] = new Pool<LevelComponent>("LevelComponent", 4, () => new LevelComponent());

//-----------------------------------------------------------------------