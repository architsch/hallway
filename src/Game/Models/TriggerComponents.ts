import { vec2, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;

export class SelfRemoveOnTimerTickComponent extends Component
{
    applyDefaultValues()
    {
    }
}
ComponentPools["SelfRemoveOnTimerTick"] = new Pool<SelfRemoveOnTimerTickComponent>("SelfRemoveOnTimerTickComponent", g.maxNumEntities, () => new SelfRemoveOnTimerTickComponent());

//-----------------------------------------------------------------------

export class SpawnOnTimerTickComponent extends Component
{
    applyDefaultValues()
    {
    }
}
ComponentPools["SpawnOnTimerTick"] = new Pool<SpawnOnTimerTickComponent>("SpawnOnTimerTickComponent", g.maxNumEntities, () => new SpawnOnTimerTickComponent());

//-----------------------------------------------------------------------

export class SelfRemoveOnCollisionWithRigidbodyComponent extends Component
{
    applyDefaultValues()
    {
    }
}
ComponentPools["SelfRemoveOnCollisionWithRigidbody"] = new Pool<SelfRemoveOnCollisionWithRigidbodyComponent>("SelfRemoveOnCollisionWithRigidbodyComponent", g.maxNumEntities, () => new SelfRemoveOnCollisionWithRigidbodyComponent());

//-----------------------------------------------------------------------

export class SpawnOnCollisionWithRigidbodyComponent extends Component
{
    applyDefaultValues()
    {
    }
}
ComponentPools["SpawnOnCollisionWithRigidbody"] = new Pool<SpawnOnCollisionWithRigidbodyComponent>("SpawnOnCollisionWithRigidbodyComponent", g.maxNumEntities, () => new SpawnOnCollisionWithRigidbodyComponent());

//-----------------------------------------------------------------------