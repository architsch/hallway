import { GeometryConfig, MaterialConfig } from "../../Config/ConfigTypes";
import { globalConfig } from "../../Config/GlobalConfig";

export default class Shader
{
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;

    constructor(gl: WebGL2RenderingContext, geometryConfig: GeometryConfig, materialConfig: MaterialConfig)
    {
        this.gl = gl;
        this.program = gl.createProgram();
        let infoLog: string;

        materialConfig.uniforms.forEach(uniform => {
            if (!uniform.usedByFragShader && !uniform.usedByVertShader)
                throw new Error(`Uniform "${uniform.configId}" is used neither by the vert nor frag shader.`);
        });

        const vertSource = `#version 300 es
${geometryConfig.vertexAttribs.map(attrib => `in ${attrib.type} ${attrib.name};`).join("\n")}
${geometryConfig.instanceAttribs.map(attrib => `in ${attrib.type} ${attrib.name};`).join("\n")}
${materialConfig.uniforms.map(uniform => this.getUniformDeclaration("vert", uniform)).join("\n")}
${materialConfig.vertShaderBody}`;
        console.log(vertSource);

        const fragSource = `#version 300 es
precision mediump float;
${materialConfig.uniforms.map(uniform => this.getUniformDeclaration("frag", uniform)).join("\n")}
${materialConfig.textureBindings.map(texture => `uniform sampler2D u_texture${texture.unit};`).join("\n")}
${materialConfig.fragShaderBody}`;
        console.log(fragSource);

        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertSource);
        gl.compileShader(vertShader);
        infoLog = gl.getShaderInfoLog(vertShader);
        if (infoLog.length > 0)
            throw new Error(`VERTEX SHADER ERROR :: ${infoLog}`);
        gl.attachShader(this.program, vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragSource);
        gl.compileShader(fragShader);
        infoLog = gl.getShaderInfoLog(vertShader);
        if (infoLog.length > 0)
            throw new Error(`FRAGMENT SHADER ERROR :: ${infoLog}`);
        gl.attachShader(this.program, fragShader);
        
        gl.linkProgram(this.program);
        infoLog = gl.getProgramInfoLog(this.program);
        if (infoLog.length > 0)
            throw new Error(`SHADER PROGRAM LINKAGE ERROR :: ${infoLog}`);
        
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
    }

    use()
    {
        this.gl.useProgram(this.program);
    }

    unuse()
    {
        this.gl.useProgram(null);
    }

    getProgram(): WebGLProgram
    {
        return this.program;
    }

    private getUniformDeclaration(shaderType: string, uniform: {configId: string, usedByVertShader: boolean, usedByFragShader: boolean}): string
    {
        const uniformConfig = globalConfig.uniformConfigById[uniform.configId];
        if (uniformConfig == undefined)
            throw new Error(`Uniform config not found (id = ${uniform.configId})`);

        if (shaderType == "vert")
        {
            if (uniform.usedByVertShader)
                return `uniform ${uniformConfig.type} ${uniform.configId};`
        }
        else if (shaderType == "frag")
        {
            if (uniform.usedByFragShader)
                return `uniform ${uniformConfig.type} ${uniform.configId};`
        }
        else
            throw new Error(`Unhandled shader type :: "${shaderType}"`);
        return "";
    }
}