export interface MeshConfig
{
    vertShaderBody: string;
    fragShaderBody: string;
    textures: {url: string, unit: number}[];
    uniforms: {name: string, type: string}[];
    numVertices: number;
    vertexAttribs: {name: string, numFloats: number, data: number[]}[];
    numInstances: number;
    instanceAttribs: {name: string, numFloats: number, data: number[]}[];
}

export type EntityConfig =
    {[componentType: string]: {[key: string]: [type: string, value: any]}};

export interface GlobalConfig
{
    meshConfigById: {[id: string]: MeshConfig};
    entityConfigById: {[id: string]: EntityConfig};
}