export default class GLBufferAttrib
{
    protected gl: WebGL2RenderingContext;

    protected index: number;
    protected size: number;
    protected stride: number;
    protected offset: number;

    constructor(gl: WebGL2RenderingContext, index: number, size: number, stride: number, offset: number)
    {
        this.gl = gl;
        this.index = index;
        this.size = size;
        this.stride = stride;
        this.offset = offset;
    }

    use()
    {
        this.gl.enableVertexAttribArray(this.index);
        this.gl.vertexAttribPointer(this.index, this.size, this.gl.FLOAT, false, this.stride, this.offset);
    }
}