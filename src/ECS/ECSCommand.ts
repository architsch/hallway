import PoolableObject from "../Util/Pooling/PoolableObject";

export default interface ECSCommand extends PoolableObject
{
    entityId: number;
    componentType: string;
}