import PoolableObject from "../Util/Pooling/PoolableObject";

export default interface ECSCommand extends PoolableObject
{
    commandType: "addEntity" | "removeEntity" | "addComponent" | "removeComponent";
    entityId: number;
    componentType: string;
}