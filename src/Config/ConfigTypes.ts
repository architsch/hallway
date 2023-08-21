export interface MeshConfig
{
    vertShaderBody: string;
    fragShaderBody: string;
    textures: {url: string, unit: number}[];
    uniforms: {name: string, type: string}[];
    vertexAttribs: {name: string, numFloats: number, data: number[]}[];
}

export type EntityConfig =
    {[componentType: string]: {[key: string]: [type: string, value: any]}};

export interface GlobalConfig
{
    meshConfigById: {[id: string]: MeshConfig};
    entityConfigById: {[id: string]: EntityConfig};
}