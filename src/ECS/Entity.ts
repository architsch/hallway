import PoolableObject from "../Util/Pooling/PoolableObject";

export default interface Entity extends PoolableObject
{
    componentIds: {[componentType: string]: number};
    alive: boolean;
    birthCount: number;
}