import { UniformConfig } from "../../Config/ConfigTypes";
import UniformSystem from "../Systems/UniformSystem";

require("../../Config/GlobalPropertiesConfig");

export const uniformConfigById: {[id: string]: UniformConfig} = {
    "u_cameraViewProj": {
        type: "mat4",
        getCurrentValue: UniformSystem.cameraViewProjMat,
    },
    "u_cameraPosition": {
        type: "mat4",
        getCurrentValue: UniformSystem.cameraPosition,
    },
    "u_ambLightColor": {
        type: "vec3",
        getCurrentValue: UniformSystem.ambLightColor,
    },
    "u_ambLightIntensity": {
        type: "float",
        getCurrentValue: UniformSystem.ambLightIntensity,
    },
    "u_spotLightPosition": {
        type: "vec3",
        getCurrentValue: UniformSystem.spotLightPosition,
    },
    "u_spotLightColor": {
        type: "vec3",
        getCurrentValue: UniformSystem.spotLightColor,
    },
    "u_spotLightIntensity": {
        type: "float",
        getCurrentValue: UniformSystem.spotLightIntensity,
    },
    "u_spotLightViewProjMat": {
        type: "mat4",
        getCurrentValue: UniformSystem.spotLightViewProjMat,
    },
};