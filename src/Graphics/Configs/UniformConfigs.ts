import { UniformConfig } from "../../Config/ConfigTypes";
import UniformSystem from "../Systems/UniformSystem";

require("../../Config/GlobalPropertiesConfig");

export const uniformConfigById: {[id: string]: UniformConfig} = {
    "u_cameraViewProj": {
        type: "mat4",
        getCurrentValue: UniformSystem.cameraViewProjMat,
    },
    "u_cameraPos": {
        type: "vec3",
        getCurrentValue: UniformSystem.cameraPos,
    },
};