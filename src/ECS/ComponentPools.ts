import { vec2, vec3 } from "gl-matrix";
import Pool from "../Util/Pooling/Pool";
import { Component, MeshInstanceComponent, TransformComponent } from "./Components";

const ComponentPools: {[componentType: string]: Pool<Component>} = {
    "Transform": new Pool<TransformComponent>(256, () => { return {
        id: undefined,
        entityId: undefined,
        position: vec3.create(),
        scale: vec2.create(),
        angleZ: 0,
        syncedWithMesh: false,
    }}),
    "MeshInstance": new Pool<MeshInstanceComponent>(256, () => { return {
        id: undefined,
        entityId: undefined,
        meshConfigId: undefined,
        uvScale: [1, 1],
        uvShift: [0, 0],
        instanceIndex: undefined,
    }}),
};
export default ComponentPools;