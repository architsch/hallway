import { GeometryConfig, MaterialConfig } from "../../Config/ConfigTypes";

export default class Shader
{
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;

    constructor(gl: WebGL2RenderingContext, geometryConfig: GeometryConfig, materialConfig: MaterialConfig)
    {
        this.gl = gl;
        this.program = gl.createProgram();
        let infoLog: string;

        const vertSource = `#version 300 es
            ${geometryConfig.vertexAttribs.map(attrib => `in ${this.getAttribTypeName(attrib.numFloats)} ${attrib.name};`).join("\n")}
            ${geometryConfig.instanceAttribs.map(attrib => `in ${this.getAttribTypeName(attrib.numFloats)} ${attrib.name};`).join("\n")}
            ${materialConfig.uniforms.map(uniform => `uniform ${uniform.type} ${uniform.name};`).join("\n")}
            ${materialConfig.vertShaderBody}
        `;
        console.log(vertSource);

        const fragSource = `#version 300 es
            precision mediump float;
            ${materialConfig.textures.map(texture => `uniform sampler2D u_texture${texture.unit};`).join("\n")}        
            ${materialConfig.fragShaderBody}
        `;
        console.log(fragSource);

        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertSource);
        gl.compileShader(vertShader);
        infoLog = gl.getShaderInfoLog(vertShader);
        if (infoLog.length > 0)
            throw new Error("VERTEX SHADER ERROR :: " + infoLog);
        gl.attachShader(this.program, vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragSource);
        gl.compileShader(fragShader);
        infoLog = gl.getShaderInfoLog(vertShader);
        if (infoLog.length > 0)
            throw new Error("FRAGMENT SHADER ERROR :: " + infoLog);
        gl.attachShader(this.program, fragShader);
        
        gl.linkProgram(this.program);
        infoLog = gl.getProgramInfoLog(this.program);
        if (infoLog.length > 0)
            throw new Error("SHADER PROGRAM LINKAGE ERROR :: " + infoLog);
        
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
    }

    use()
    {
        this.gl.useProgram(this.program);
    }

    getProgram(): WebGLProgram
    {
        return this.program;
    }

    private getAttribTypeName(numFloats: number): string
    {
        switch (numFloats)
        {
            case 1: return "float";
            case 2: return "vec2";
            case 3: return "vec3";
            case 4: return "vec4";
            default: throw new Error(`There is no attribute type with ${numFloats} floating-point elements.`);
        }
    }
}