import { mat4, vec2, vec3 } from "gl-matrix";
import Pool from "../Util/Pooling/Pool";
import { CameraComponent, Component, GraphicsComponent, KeyInputComponent, MeshComponent, MeshInstanceComponent, TransformComponent } from "./Components";

const ComponentPools: {[componentType: string]: Pool<Component>} = {
    "Transform": new Pool<TransformComponent>(256, () => { return {
        id: undefined,
        entityId: undefined,
        position: vec3.fromValues(0, 0, 0),
        rotation: vec3.fromValues(0, 0, 0),
        scale: vec3.fromValues(1, 1, 1),
        localMat: mat4.create(),
        worldMat: mat4.create(),
        matrixSynced: false,
        meshInstanceSynced: false,
    }}),
    "Mesh": new Pool<MeshComponent>(16, () => { return {
        id: undefined,
        entityId: undefined,
        meshConfigId: undefined,
        mesh: undefined,
    }}),
    "MeshInstance": new Pool<MeshInstanceComponent>(256, () => { return {
        id: undefined,
        entityId: undefined,
        meshConfigId: undefined,
        instanceIndex: -1,
        uvScale: [1, 1],
        uvShift: [0, 0],
    }}),
    "Camera": new Pool<CameraComponent>(1, () => { return {
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
    }}),
    "KeyInput": new Pool<KeyInputComponent>(64, () => { return {
        id: undefined,
        entityId: undefined,
        key: undefined,
    }}),
    "Graphics": new Pool<GraphicsComponent>(1, () => { return {
        id: undefined,
        entityId: undefined,
        gl: undefined
    }}),
};
export default ComponentPools;