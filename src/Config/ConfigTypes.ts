import ECSManager from "../ECS/ECSManager";

export interface UniformConfig
{
    type: string;
    getCurrentValue: (ecs: ECSManager) => any;
}

export interface TextureConfig
{
    url: string;
}

export interface GeometryConfig
{
    numVertices: number;
    vertexAttribs: {name: string, type: string, data: number[]}[];
    numInstances: number;
    instanceAttribs: {name: string, type: string, data: number[]}[];
}

export interface MaterialConfig
{
    vertShaderBody: string;
    fragShaderBody: string;
    textureBindings: {textureConfigId: string, unit: number}[];
    uniforms: {configId: string, usedByVertShader: boolean, usedByFragShader: boolean}[];
}

export interface MeshConfig
{
    geometryConfigId: string;
    materialConfigId: string;
}

export type EntityConfig =
    {[componentType: string]: {[key: string]: [type: string, value: any]}};

export interface GlobalConfig
{
    uniformConfigById: {[id: string]: UniformConfig};
    textureConfigById: {[id: string]: TextureConfig};
    geometryConfigById: {[id: string]: GeometryConfig};
    materialConfigById: {[id: string]: MaterialConfig};
    meshConfigById: {[id: string]: MeshConfig};
    entityConfigById: {[id: string]: EntityConfig};
}