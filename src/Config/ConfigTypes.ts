export interface TextureConfig {
    filePath: string;
}

export interface MaterialConfig {
    fragShaderCode: string;
    vertShaderCode: string;
    uniforms: {[uniformName: string]: {value: any}};
    textureConfigId: string;
}

export interface VertexAttribConfig {
    name: string;
    numFloats: number;
}

export interface InstanceAttribConfig {
    name: string;
    numFloats: number;
}

export interface GeometryConfig {
    vertexBuffer: Float32Array;
    vertexAttribs: Array<VertexAttribConfig>;

    instanceBuffer: Float32Array;
    instanceAttribs: Array<InstanceAttribConfig>;
}

export interface MeshConfig {
    geometryConfigId: string;
    materialConfigId: string;
}

export interface ComponentConfig {
}

export interface EntityConfig {
    meshConfigId: string;
    componentConfigIds: string;
}

export interface SystemConfig {
}

export interface GlobalConfig {
    textureConfigs: {[configId: string]: TextureConfig};
    materialConfigs: {[configId: string]: MaterialConfig};
    geometryConfigs: {[configId: string]: GeometryConfig};
    meshConfigs: {[configId: string]: MeshConfig};
    componentConfigs: {[configId: string]: ComponentConfig};
    entityConfigs: {[configId: string]: EntityConfig};
}