import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const s = g.spriteAtlasGridCellSize;

export const coreEntityConfigById: {[id: string]: EntityConfig} = {
    "empty": {
    },
    "stats": {
        "StatsComponent": {
        },
    },
    "player": {
        "PlayerComponent": {},
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(10, 10, 10)],
            rotation: ["vec3", vec3.fromValues(-45, 45, 0)],
        },
        "KinematicsComponent": {
            decelerationRate: ["number", 5],
        },
        "RigidbodyComponent": {
        },
        "CameraComponent": {
            fovy: ["number", 45 * deg2rad],
            aspectRatio: ["number", 2],
            near: ["number", 0.1],
            far: ["number", 100],
        },
    },

    "cube": {
        "TransformComponent": {},
        "MeshInstanceComponent": {meshConfigId: ["string", "cube"]},
        "SpriteComponent": {
            uvShift: ["vec2", vec2.fromValues(15*s, 8*s)],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            boundingBoxSize: ["vec3", vec3.fromValues(1, 1, 1)],
        },
    },
    "column": {
        "TransformComponent": {},
        "MeshInstanceComponent": {meshConfigId: ["string", "column"]},
        "SpriteComponent": {
            uvShift: ["vec2", vec2.fromValues(15*s, 8*s)],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            boundingBoxSize: ["vec3", vec3.fromValues(1.0, g.worldBoundSize[1], 1.0)],
        },
    },
    "floor": {
        "TransformComponent": {},
        "MeshInstanceComponent": {meshConfigId: ["string", "floor"]},
        "SpriteComponent": {},
    },
};