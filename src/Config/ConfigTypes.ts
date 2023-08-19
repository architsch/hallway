export interface MeshConfig
{
    vertShaderBody: string;
    fragShaderBody: string;
    textures: {url: string, unit: number}[];
    uniforms: {name: string, type: string}[];
    vertexAttribs: {name: string, numFloats: number, data: number[]}[];
}

export interface EntityConfig
{
    componentValueOverrides: {[componentType: string]: {[key: string]: any}};
}

export interface GlobalConfig
{
    meshConfigById: {[id: string]: MeshConfig};
    entityConfigById: {[id: string]: EntityConfig};
}