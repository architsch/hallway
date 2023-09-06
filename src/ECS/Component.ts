import PoolableObject from "../Util/Pooling/PoolableObject";

export abstract class Component implements PoolableObject
{
    id: number = undefined;
    entityId: number = undefined;

    abstract applyDefaultValues(): void;
}