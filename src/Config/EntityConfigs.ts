import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "./ConfigTypes";

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
            up: ["vec3", vec3.fromValues(0, 1, 0)],
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
            up: ["vec3", vec3.fromValues(0, 1, 0)],
        }
    },
    "sprite": {
        "Transform": {
            position: ["vec3", vec3.fromValues(0, 0, 0)],
            rotation: ["vec3", vec3.fromValues(0, 0, 0)],
            scale: ["vec3", vec3.fromValues(1, 1, 1)],
        },
        "MeshInstance": {
            meshConfigId: ["string", "quad_unlit"],
            uvScale: ["vec2", vec2.fromValues(s, s)],
            uvShift: ["vec2", vec2.fromValues(0, 0)],
            color: ["vec3", vec3.fromValues(1.0, 1.0, 1.0)],
        }
    },
    "cube": {
        "Transform": {
            position: ["vec3", vec3.fromValues(0, 0, 0)],
            rotation: ["vec3", vec3.fromValues(0, 0, 0)],
            scale: ["vec3", vec3.fromValues(1, 1, 1)],
        },
        "MeshInstance": {
            meshConfigId: ["string", "cube_diffuse"],
            uvScale: ["vec2", vec2.fromValues(s, s)],
            uvShift: ["vec2", vec2.fromValues(14 * s, 8 * s)],
            color: ["vec3", vec3.fromValues(1.0, 1.0, 1.0)],
        }
    },
};