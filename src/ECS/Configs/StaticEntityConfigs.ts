import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const worldBoundColliderThickness = 5;
const s = g.spriteAtlasGridCellSize;

export const staticEntityConfigById: {[id: string]: EntityConfig} = {
    "cube": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "cube"]},
        "Sprite": {
            uvShift: ["vec2", vec2.fromValues(15*s, 8*s)],
        },
        "Rigidbody": {},
        "Collider": {
            boundingBoxSize: ["vec3", vec3.fromValues(1, 1, 1)],
        },
    },
    "column": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "column"]},
        "Sprite": {
            uvShift: ["vec2", vec2.fromValues(15*s, 8*s)],
        },
        "Rigidbody": {},
        "Collider": {
            boundingBoxSize: ["vec3", vec3.fromValues(1.0, g.worldChunkSize[1], 1.0)],
        },
    },
    "floor": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "floor"]},
        "Sprite": {},
    },
    "wall": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "wall"]},
        "Sprite": {},
    },
};