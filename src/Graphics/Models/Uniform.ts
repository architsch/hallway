import { mat2, mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";

export abstract class Uniform<T>
{
    protected gl: WebGL2RenderingContext;
    protected configId: string;
    protected loc: WebGLUniformLocation;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, configId: string)
    {
        this.gl = gl;
        this.configId = configId;
        gl.useProgram(program);
        this.loc = gl.getUniformLocation(program, configId);
    }

    getConfigId(): string
    {
        return this.configId;
    }

    getLoc(): WebGLUniformLocation
    {
        return this.loc;
    }

    abstract updateValue(value: T): void;
}

export class UniformFloat extends Uniform<number>
{
    updateValue(value: number)
    {
        this.gl.uniform1f(this.loc, value);
    }
}
export class UniformVec2 extends Uniform<vec2>
{
    updateValue(value: vec2)
    {
        this.gl.uniform2fv(this.loc, value);
    }
}
export class UniformVec3 extends Uniform<vec3>
{
    updateValue(value: vec3)
    {
        this.gl.uniform3fv(this.loc, value);
    }
}
export class UniformVec4 extends Uniform<vec4>
{
    updateValue(value: vec4)
    {
        this.gl.uniform4fv(this.loc, value);
    }
}
export class UniformMat2 extends Uniform<mat2>
{
    updateValue(value: mat2)
    {
        this.gl.uniformMatrix2fv(this.loc, false, value);
    }
}
export class UniformMat3 extends Uniform<mat3>
{
    updateValue(value: mat3)
    {
        this.gl.uniformMatrix3fv(this.loc, false, value);
    }
}
export class UniformMat4 extends Uniform<mat4>
{
    updateValue(value: mat4)
    {
        this.gl.uniformMatrix4fv(this.loc, false, value);
    }
}