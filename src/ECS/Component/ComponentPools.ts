import Pool from "../../Util/Pooling/Pool";
import { Component, MeshComponent, TransformComponent } from "./Components";

const ComponentPools: {[componentType: string]: Pool<Component>} = {
    "Transform": new Pool<TransformComponent>(256, () => { return {
        id: undefined,
        entityId: undefined,
        x: 0, y: 0, z: 0,
        rotX: 0, rotY: 0, rotZ: 0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        syncedWithMesh: false,
    }}),
    "Mesh": new Pool<MeshComponent>(256, () => { return {
        id: undefined,
        entityId: undefined,
        meshId: undefined,
        mesh: undefined,
    }}),
};
export default ComponentPools;