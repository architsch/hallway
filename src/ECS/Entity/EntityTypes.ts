export const EntityTypes: {[type: string]: Array<{componentType: string, componentValues: any}>} = {
    "Default": [
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
            componentType: "Mesh",
            componentValues: {
                meshId: "box_red"
            },
        }
    ],
};