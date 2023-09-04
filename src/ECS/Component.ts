import PoolableObject from "../Util/Pooling/PoolableObject";

export interface Component extends PoolableObject
{
    entityId: number;
}