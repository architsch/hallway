import GeometryBuilder from "../Util/Geometry/GeometryBuilder";
import { GeometryConfig } from "./ConfigTypes";

const quad = GeometryBuilder.quad();
const cube = GeometryBuilder.cube();

export const geometryConfigById: {[id: string]: GeometryConfig} = {
    "quad": {
        numVertices: quad.positionData.length / 3,
        vertexAttribs: [
            {name: "position", type: "vec3", data: quad.positionData},
            {name: "normal", type: "vec3", data: quad.normalData},
            {name: "uv", type: "vec2", data: quad.uvData},
        ],
        numInstances: 256,
        instanceAttribs: [
            {name: "model", type: "mat4", data: undefined},
            {name: "uvScale", type: "vec2", data: undefined},
            {name: "uvShift", type: "vec2", data: undefined},
            {name: "color", type: "vec3", data: undefined},
        ],
    },
    "cube": {
        numVertices: cube.positionData.length / 3,
        vertexAttribs: [
            {name: "position", type: "vec3", data: cube.positionData},
            {name: "normal", type: "vec3", data: cube.normalData},
            {name: "uv", type: "vec2", data: cube.uvData},
        ],
        numInstances: 256,
        instanceAttribs: [
            {name: "model", type: "mat4", data: undefined},
            {name: "uvScale", type: "vec2", data: undefined},
            {name: "uvShift", type: "vec2", data: undefined},
            {name: "color", type: "vec3", data: undefined},
        ],
    },
};