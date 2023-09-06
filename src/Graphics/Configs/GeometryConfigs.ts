import { GeometryConfig } from "../../Config/ConfigTypes";
import GeometryConfigFactory from "../Factories/GeometryConfigFactory";

export const geometryConfigById: {[id: string]: GeometryConfig} = {
    "quad_textureUnlit": GeometryConfigFactory.make("quad", {texturing: "texture", lighting: "unlit"}, 256),
    "cube_textureDiffuse": GeometryConfigFactory.make("cube", {texturing: "texture", lighting: "diffuse"}, 256),
    "plane_textureDiffuse": GeometryConfigFactory.make("plane", {texturing: "texture", lighting: "diffuse"}, 256),
};