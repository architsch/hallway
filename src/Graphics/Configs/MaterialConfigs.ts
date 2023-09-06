import { MaterialConfig } from "../../Config/ConfigTypes";
import MaterialConfigFactory from "../Factories/MaterialConfigFactory";

export const materialConfigById: {[id: string]: MaterialConfig} = {
    "textureUnlit": MaterialConfigFactory.make({texturing: "texture", lighting: "unlit"}),
    "textureDiffuse": MaterialConfigFactory.make({texturing: "texture", lighting: "diffuse"}),
    "colorUnlit": MaterialConfigFactory.make({texturing: "color", lighting: "unlit"}),
    "colorDiffuse": MaterialConfigFactory.make({texturing: "color", lighting: "diffuse"}),
};