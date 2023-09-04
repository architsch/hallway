import { mat4, vec2, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";
import Mesh from "./Mesh";

export interface GraphicsComponent extends Component
{
    gl: WebGL2RenderingContext;
}
ComponentPools["Graphics"] = new Pool<GraphicsComponent>(1, () => { return {
    id: undefined,
    entityId: undefined,
    gl: undefined
};});

//-----------------------------------------------------------------------

export interface LightComponent extends Component
{
    ambLightColor: vec3;
    ambLightIntensity: number;
    spotLightColor: vec3;
    spotLightIntensity: number;

    falloffStartAngle: number;
    falloffEndAngle: number;
    maxDist: number;
    linearAttenFactor: number;
    squareAttenFactor: number;

    position: vec3;
    forward: vec3;
    up: vec3;

    viewMat: mat4;
    projMat: mat4;
    viewProjMat: mat4;
    projMatrixSynced: boolean;
    viewMatrixSynced: boolean;
}
ComponentPools["Light"] = new Pool<LightComponent>(1, () => { return {
    id: undefined,
    entityId: undefined,
    ambLightColor: vec3.fromValues(1, 1, 1),
    ambLightIntensity: 0.2,
    spotLightColor: vec3.fromValues(1, 1, 1),
    spotLightIntensity: 0.8,
    falloffStartAngle: Math.PI * 0.2,
    falloffEndAngle: Math.PI * 0.3,
    maxDist: 100,
    linearAttenFactor: 0.05,
    squareAttenFactor: 0.05,
    position: vec3.create(),
    forward: vec3.create(),
    up: vec3.fromValues(0, 1, 0),
    viewMat: mat4.create(),
    projMat: mat4.create(),
    viewProjMat: mat4.create(),
    projMatrixSynced: false,
    viewMatrixSynced: false,
};});

//-----------------------------------------------------------------------

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
ComponentPools["Camera"] = new Pool<CameraComponent>(1, () => { return {
    id: undefined,
    entityId: undefined,
    fovy: 1,
    aspectRatio: 1,
    near: 0.1,
    far: 100,
    position: vec3.create(),
    forward: vec3.create(),
    up: vec3.fromValues(0, 1, 0),
    viewMat: mat4.create(),
    projMat: mat4.create(),
    viewProjMat: mat4.create(),
    projMatrixSynced: false,
    viewMatrixSynced: false,
};});

//-----------------------------------------------------------------------

export interface MeshComponent extends Component
{
    meshConfigId: string;
    mesh: Mesh;
}
ComponentPools["Mesh"] = new Pool<MeshComponent>(16, () => { return {
    id: undefined,
    entityId: undefined,
    meshConfigId: undefined,
    mesh: undefined,
};});

//-----------------------------------------------------------------------

export interface MeshInstanceComponent extends Component
{
    meshConfigId: string;
    instanceIndex: number;
    uvScale: vec2;
    uvShift: vec2;
    color: vec3;
}
ComponentPools["MeshInstance"] = new Pool<MeshInstanceComponent>(256, () => { return {
    id: undefined,
    entityId: undefined,
    meshConfigId: undefined,
    instanceIndex: -1,
    uvScale: vec2.fromValues(1, 1),
    uvShift: vec2.fromValues(0, 0),
    color: vec3.fromValues(1, 1, 1),
};});

//-----------------------------------------------------------------------