import { vec2, vec3 } from "gl-matrix";
import PoolableObject from "../Util/Pooling/PoolableObject";

export interface Component extends PoolableObject
{
    entityId: number;
}

export interface TransformComponent extends Component
{
    position: vec3;
    scale: vec2;
    angleZ: number;
    syncedWithMesh: boolean;
}

export interface MeshInstanceComponent extends Component
{
    meshId: string;
    uvScale: [number, number];
    uvShift: [number, number];
    instanceIndex: number;
}