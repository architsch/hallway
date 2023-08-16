export abstract class GLUniform<T>
{
    protected gl: WebGL2RenderingContext;
    protected name: string;
    protected loc: WebGLUniformLocation;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, name: string)
    {
        this.gl = gl;
        this.name = name;
        this.loc = gl.getUniformLocation(program, name);
    }

    getName(): string
    {
        return this.name;
    }

    getLoc(): WebGLUniformLocation
    {
        return this.loc;
    }

    abstract updateValue(value: T): void;
}

export class GLUniformFloat extends GLUniform<number>
{
    updateValue(value: number)
    {
        this.gl.uniform1f(this.loc, value);
    }
}
export class GLUniformVec2 extends GLUniform<[number, number]>
{
    updateValue(value: [number, number])
    {
        this.gl.uniform2f(this.loc, value[0], value[1]);
    }
}
export class GLUniformVec3 extends GLUniform<[number, number, number]>
{
    updateValue(value: [number, number, number])
    {
        this.gl.uniform3f(this.loc, value[0], value[1], value[2]);
    }
}
export class GLUniformMat3 extends GLUniform<Float32List>
{
    updateValue(value: Float32List)
    {
        this.gl.uniformMatrix3fv(this.loc, false, value);
    }
}
export class GLUniformMat4 extends GLUniform<Float32List>
{
    updateValue(value: Float32List)
    {
        this.gl.uniformMatrix4fv(this.loc, false, value);
    }
}