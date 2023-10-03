import PoolableObject from "../Util/Pooling/PoolableObject";
import { ComponentBitMask } from "./Component";

export default interface Entity extends PoolableObject
{
    componentBitMask: ComponentBitMask;
    alive: boolean;
}