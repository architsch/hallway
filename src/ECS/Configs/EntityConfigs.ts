import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";

const s = 0.0625; // sprite atlas's cell size

export const entityConfigById: {[id: string]: EntityConfig} = {
    "empty": {
    },
    "mainCamera": {
        "Camera": {
            fovy: ["number", 45 * Math.PI / 180],
            aspectRatio: ["number", 2],
            near: ["number", 0.1],
            far: ["number", 100],
            position: ["vec3", vec3.fromValues(0, 0, 10)],
            forward: ["vec3", vec3.fromValues(0, 0, -1)],
        }
    },
    "mainLight": {
        "Light": {
            ambLightColor: ["vec3", vec3.fromValues(1, 1, 1)],
            ambLightIntensity: ["number", 0.3],
            spotLightColor: ["vec3", vec3.fromValues(1, 1, 1)],
            spotLightIntensity: ["number", 0.7],
            falloffStartAngle: ["number", 45 * Math.PI / 180],
            falloffEndAngle: ["number", 55 * Math.PI / 180],
            maxDist: ["number", 100],
            linearAttenFactor: ["number", 0.05],
            squareAttenFactor: ["number", 0.05],
            position: ["vec3", vec3.fromValues(-10, 20, 5)],
            forward: ["vec3", vec3.fromValues(0.4364, -0.8729, -0.2182)],
        }
    },
    "particle": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {},
    },
    "plane": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "plane"]},
        "Sprite": {},
    },
    "block": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "block"]},
        "Sprite": {},
    },
};