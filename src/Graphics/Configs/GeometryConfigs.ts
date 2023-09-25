import { GeometryConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import GeometryConfigFactory from "../Factories/GeometryConfigFactory";

require("../../Config/GlobalPropertiesConfig");

const g = globalPropertiesConfig;

export const geometryConfigById: {[id: string]: GeometryConfig} = {
    "quad_textureUnlit": GeometryConfigFactory.make("quad", {texturing: "texture", lighting: "unlit"}, g.maxNumEntities),
    "cube_textureDiffuse": GeometryConfigFactory.make("cube", {texturing: "texture", lighting: "diffuse"}, g.maxNumEntities),
    "column_textureDiffuse": GeometryConfigFactory.make("column", {texturing: "texture", lighting: "diffuse"}, g.maxNumEntities),
    "floor_textureDiffuse": GeometryConfigFactory.make("floor", {texturing: "texture", lighting: "diffuse"}, g.maxNumEntities),
    "wall_textureDiffuse": GeometryConfigFactory.make("wall", {texturing: "texture", lighting: "diffuse"}, g.maxNumEntities),
};