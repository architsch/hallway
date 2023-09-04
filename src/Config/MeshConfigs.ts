import { MeshConfig } from "./ConfigTypes";

export const meshConfigById: {[id: string]: MeshConfig} = {
    "quad_unlit": {
        geometryConfigId: "quad",
        materialConfigId: "unlit",
    },
    "cube_diffuse": {
        geometryConfigId: "cube",
        materialConfigId: "diffuse",
    },
};