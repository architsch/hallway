import { mat4, vec2, vec3 } from "gl-matrix";
import PoolableObject from "../Util/Pooling/PoolableObject";
import Mesh from "../Graphics/Models/Mesh";

export interface Component extends PoolableObject
{
    entityId: number;
}

export interface TransformComponent extends Component
{
    position: vec3;
    rotation: vec3;
    scale: vec3;
    
    localMat: mat4;
    worldMat: mat4;
    matrixSynced: boolean;
}

export interface MeshComponent extends Component
{
    meshConfigId: string;
    mesh: Mesh;
}

export interface MeshInstanceComponent extends Component
{
    meshConfigId: string;
    instanceIndex: number;
    uvScale: vec2;
    uvShift: vec2;
}

export interface CameraComponent extends Component
{
    fovy: number;
    aspectRatio: number;
    near: number;
    far: number;

    position: vec3;
    forward: vec3;
    up: vec3;

    viewMat: mat4;
    projMat: mat4;
    viewProjMat: mat4;
    projMatrixSynced: boolean;
    viewMatrixSynced: boolean;
}

export interface KeyInputComponent extends Component
{
    key: string;
}

export interface GraphicsComponent extends Component
{
    gl: WebGL2RenderingContext;
}