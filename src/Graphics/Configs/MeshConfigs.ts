import { MeshConfig } from "../../Config/ConfigTypes";

export const meshConfigById: {[id: string]: MeshConfig} = {
    "particle": {
        geometryConfigId: "quad_textureUnlit",
        materialConfigId: "textureUnlit",
    },
    "block": {
        geometryConfigId: "cube_textureDiffuse",
        materialConfigId: "textureDiffuse",
    },
    "plane": {
        geometryConfigId: "plane_textureDiffuse",
        materialConfigId: "textureDiffuse",
    },
};