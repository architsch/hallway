import { MeshConfig } from "../../Config/ConfigTypes";

require("../../Config/GlobalPropertiesConfig");

export const meshConfigById: {[id: string]: MeshConfig} = {
    "particle": {
        geometryConfigId: "quad_textureUnlit",
        materialConfigId: "textureUnlit",
    },
    "cube": {
        geometryConfigId: "cube_textureDiffuse",
        materialConfigId: "textureDiffuse",
    },
    "column": {
        geometryConfigId: "column_textureDiffuse",
        materialConfigId: "textureDiffuse",
    },
    "floor": {
        geometryConfigId: "floor_textureDiffuse",
        materialConfigId: "textureDiffuse",
    },
    "wall": {
        geometryConfigId: "wall_textureDiffuse",
        materialConfigId: "textureDiffuse",
    },
};