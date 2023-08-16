import { GLUniform } from "./GLUniform";

export default class GLShader
{
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private uniforms: {[name: string]: GLUniform<any>};

    constructor(gl: WebGL2RenderingContext, vertSource: string, fragSource: string)
    {
        this.gl = gl;
        this.program = gl.createProgram();
        this.uniforms = {};
        let infoLog: string;

        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertSource);
        gl.compileShader(vertShader);
        infoLog = gl.getShaderInfoLog(vertShader);
        if (infoLog.length > 0)
            throw new Error(infoLog);
        gl.attachShader(this.program, vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragSource);
        gl.compileShader(fragShader);
        infoLog = gl.getShaderInfoLog(vertShader);
        if (infoLog.length > 0)
            throw new Error(infoLog);
        gl.attachShader(this.program, fragShader);
        
        gl.linkProgram(this.program);
        infoLog = gl.getProgramInfoLog(this.program);
        if (infoLog.length > 0)
            throw new Error(infoLog);
        
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
    }

    use()
    {
        this.gl.useProgram(this.program);
    }

    addUniform(uniform: GLUniform<any>)
    {
        this.uniforms[uniform.getName()] = uniform;
    }

    getUniformLoc(name: string): WebGLUniformLocation
    {
        return this.uniforms[name].getLoc();
    }

    updateUniform(name: string, value: any)
    {
        this.uniforms[name].updateValue(value);
    }
}