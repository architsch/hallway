import PoolableObject from "../Util/Pooling/PoolableObject";

export interface Component extends PoolableObject
{
    entityId: number;
}

export interface TransformComponent extends Component
{
    x: number;
    y: number;
    z: number;
    rotX: number;
    rotY: number;
    rotZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    syncedWithMesh: boolean;
}

export interface MeshInstanceComponent extends Component
{
    meshId: string;
    instanceIndex: number;
}