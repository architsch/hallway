import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";

require("../../Config/GlobalPropertiesConfig");

const s = 0.0625; // sprite atlas's cell size
const deg2rad = Math.PI / 180;

export const entityConfigById: {[id: string]: EntityConfig} = {
    "empty": {
    },
    "player": {
        "Player": {},
        "Transform": {},
        "Rigidbody": {
            decelerationRate: ["number", 5],
            hitboxSize: ["vec3", vec3.fromValues(1.25, 3, 1.25)],
        },
        "Camera": {
            fovy: ["number", 45 * Math.PI / 180],
            aspectRatio: ["number", 2],
            near: ["number", 0.1],
            far: ["number", 100],
        }
    },
    "mainLight": {
        "Transform": {
            position: ["vec3", vec3.fromValues(-100, 200, 50)],
            rotation: ["vec3", vec3.fromValues(45 * deg2rad, 45 * deg2rad, 0)],
        },
        "Light": {
            ambLightColor: ["vec3", vec3.fromValues(1, 1, 1)],
            ambLightIntensity: ["number", 0.3],
            spotLightColor: ["vec3", vec3.fromValues(1, 1, 1)],
            spotLightIntensity: ["number", 0.7],
            falloffStartAngle: ["number", 45 * Math.PI / 180],
            falloffEndAngle: ["number", 55 * Math.PI / 180],
            linearAttenFactor: ["number", 0],
            squareAttenFactor: ["number", 0],
        }
    },
    "particle": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {},
    },
    "actor": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {},
        "Rigidbody": {
            hitboxSize: ["vec3", vec3.fromValues(2, 2, 2)],
        },
    },
    "block": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "block"]},
        "Sprite": {},
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