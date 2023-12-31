import { GeometryConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import ShadingOptions from "../Models/ShadingOptions";
import VerticesData from "../Models/VerticesData";
import GeometryVerticesFactory from "./GeometryVerticesFactory";

require("../../Config/GlobalPropertiesConfig");

const g = globalPropertiesConfig;

const verticesDataByGeometryType: {[geometryType: string]: VerticesData} = {
    "quad": GeometryVerticesFactory.quad(1, 1, 1, 1),
    "cube": GeometryVerticesFactory.cuboid(1, 1, 1, 1, 1),
    "column": GeometryVerticesFactory.cuboid(1, g.worldBoundSize[1], 1, 1, g.worldBoundSize[1]),
    "floor": GeometryVerticesFactory.quad(g.worldBoundSize[0], g.worldBoundSize[2], g.worldBoundSize[0], g.worldBoundSize[2]),
    "wall": GeometryVerticesFactory.quad(g.worldBoundSize[2], g.worldBoundSize[1], g.worldBoundSize[2], g.worldBoundSize[1]),
};

export default class GeometryConfigFactory
{
    static make(geometryType: string, options: ShadingOptions, numInstances: number): GeometryConfig
    {
        const verticesData = verticesDataByGeometryType[geometryType];
        if (verticesData == undefined)
            throw new Error(`Geometry type "${geometryType}" has no corresponding VerticesData.`);

        return {
            numVertices: verticesData.positionData.length / 3,
            vertexAttribs: this.makeVertexAttribs(options, verticesData),
            numInstances,
            instanceAttribs: this.makeInstanceAttribs(options),
        };
    }

    private static makeVertexAttribs(options: ShadingOptions, verticesData: VerticesData): {name: string, type: string, data: number[]}[]
    {
        const vertexAttribs: {name: string, type: string, data: number[]}[] = [];

        vertexAttribs.push({name: "position", type: "vec3", data: verticesData.positionData});
        if (options.lighting == "diffuse")
            vertexAttribs.push({name: "normal", type: "vec3", data: verticesData.normalData});
        if (options.texturing == "texture")
            vertexAttribs.push({name: "uv", type: "vec2", data: verticesData.uvData});

        return vertexAttribs;
    }

    private static makeInstanceAttribs(options: ShadingOptions): {name: string, type: string, data: number[]}[]
    {
        const instanceAttribs: {name: string, type: string, data: number[]}[] = [];

        instanceAttribs.push({name: "worldMat", type: "mat4", data: undefined});
        
        if (options.texturing == "texture")
        {
            instanceAttribs.push({name: "uvScale", type: "vec2", data: undefined});
            instanceAttribs.push({name: "uvShift", type: "vec2", data: undefined});
        }
        else if (options.texturing == "color")
        {
            instanceAttribs.push({name: "color", type: "vec3", data: undefined});
        }

        return instanceAttribs;
    }
}