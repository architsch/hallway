import { mat4, vec3 } from "gl-matrix";
import { Component } from "../../ECS/Component";
import ComponentPools from "../../ECS/ComponentPools";
import Pool from "../../Util/Pooling/Pool";

export interface TransformComponent extends Component
{
    position: vec3;
    rotation: vec3;
    scale: vec3;
    
    localMat: mat4;
    worldMat: mat4;
    matrixSynced: boolean;
    meshInstanceSynced: boolean;
}
ComponentPools["Transform"] = new Pool<TransformComponent>(256, () => { return {
    id: undefined,
    entityId: undefined,

    position: vec3.fromValues(0, 0, 0),
    rotation: vec3.fromValues(0, 0, 0),
    scale: vec3.fromValues(1, 1, 1),

    localMat: mat4.create(),
    worldMat: mat4.create(),
    matrixSynced: false,
    meshInstanceSynced: false,
};});

//-----------------------------------------------------------------------

export interface RigidbodyComponent extends Component
{
}
ComponentPools["Rigidbody"] = new Pool<RigidbodyComponent>(256, () => { return {
    id: undefined,
    entityId: undefined,
};});

//-----------------------------------------------------------------------

export interface OscillatorComponent extends Component
{
}
ComponentPools["Oscillator"] = new Pool<OscillatorComponent>(256, () => { return {
    id: undefined,
    entityId: undefined,
};});

//-----------------------------------------------------------------------

export interface HopperComponent extends Component
{
}
ComponentPools["Hopper"] = new Pool<HopperComponent>(256, () => { return {
    id: undefined,
    entityId: undefined,
};});

//-----------------------------------------------------------------------

export interface RotorComponent extends Component
{
}
ComponentPools["Rotor"] = new Pool<RotorComponent>(256, () => { return {
    id: undefined,
    entityId: undefined,
};});