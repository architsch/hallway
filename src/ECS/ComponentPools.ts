import Pool from "../Util/Pooling/Pool";
import { Component, MeshInstanceComponent, TransformComponent } from "./Components";

const ComponentPools: {[componentType: string]: Pool<Component>} = {
    "Transform": new Pool<TransformComponent>(256, () => { return {
        id: undefined,
        entityId: undefined,
        x: 0, y: 0, z: 0,
        rotX: 0, rotY: 0, rotZ: 0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        syncedWithMesh: false,
    }}),
    "MeshInstance": new Pool<MeshInstanceComponent>(256, () => { return {
        id: undefined,
        entityId: undefined,
        meshId: undefined,
        instanceIndex: undefined,
    }}),
};
export default ComponentPools;