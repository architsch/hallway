import PoolableObject from "../Util/Pooling/PoolableObject";

export default interface Entity extends PoolableObject
{
    parentId: number;
    childIds: number[];
    componentIds: {[componentType: string]: number};
}