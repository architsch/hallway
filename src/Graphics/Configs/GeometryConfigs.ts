import { GeometryConfig } from "../../Config/ConfigTypes";
import GeometryConfigFactory from "../Factories/GeometryConfigFactory";

require("../../Config/GlobalPropertiesConfig");

export const geometryConfigById: {[id: string]: GeometryConfig} = {
    "quad_textureUnlit": GeometryConfigFactory.make("quad", {texturing: "texture", lighting: "unlit"}, 32),
    "cube_textureDiffuse": GeometryConfigFactory.make("cube", {texturing: "texture", lighting: "diffuse"}, 32),
    "floor_textureDiffuse": GeometryConfigFactory.make("floor", {texturing: "texture", lighting: "diffuse"}, 32),
    "wall_textureDiffuse": GeometryConfigFactory.make("wall", {texturing: "texture", lighting: "diffuse"}, 32),
};