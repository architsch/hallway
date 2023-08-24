export interface GeometryConfig
{
    numVertices: number;
    vertexAttribs: {name: string, numFloats: number, data: number[]}[];
    numInstances: number;
    instanceAttribs: {name: string, numFloats: number, data: number[]}[];
}

export interface MaterialConfig
{
    vertShaderBody: string;
    fragShaderBody: string;
    textures: {url: string, unit: number}[];
    uniforms: {name: string, type: string}[];
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
    geometryConfigById: {[id: string]: GeometryConfig};
    materialConfigById: {[id: string]: MaterialConfig};
    meshConfigById: {[id: string]: MeshConfig};
    entityConfigById: {[id: string]: EntityConfig};
}