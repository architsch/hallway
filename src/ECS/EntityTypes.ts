export const EntityTypes: {[type: string]: Array<{componentType: string, componentValues: any}>} = {
    "default": [
        {
            componentType: "Transform",
            componentValues: {
                x: 0, y: 0, z: 0,
                eulerX: 0, eulerY: 0, eulerZ: 0,
                scaleX: 1, scaleY: 1, scaleZ: 1,
                syncedWithMesh: false,
            },
        },
        {
            componentType: "MeshInstance",
            componentValues: {
                meshId: "default",
                uvScale: [0.0625, 0.0625],
                uvShift: [0, 0],
            },
        }
    ],
};