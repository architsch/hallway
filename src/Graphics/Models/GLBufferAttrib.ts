export default class GLBufferAttrib
{
    protected gl: WebGL2RenderingContext;

    protected index: number;
    protected size: number;
    protected stride: number;
    protected offset: number;
    protected instanced: boolean;

    constructor(gl: WebGL2RenderingContext, index: number, size: number, stride: number, offset: number, instanced: boolean)
    {
        this.gl = gl;
        this.index = index;
        this.size = size;
        this.stride = stride;
        this.offset = offset;
        this.instanced = instanced;

        if (index < 0)
            throw new Error(`Invalid attrib index (index = ${index})`);
    }

    use()
    {
        this.gl.enableVertexAttribArray(this.index);
        this.gl.vertexAttribPointer(this.index, this.size, this.gl.FLOAT, false, this.stride, this.offset);
        if (this.instanced)
            this.gl.vertexAttribDivisor(this.index, 1);
    }
}