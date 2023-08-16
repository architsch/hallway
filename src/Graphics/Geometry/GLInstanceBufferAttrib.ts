import GLBufferAttrib from "./GLBufferAttrib";

export default class GLInstanceBufferAttrib extends GLBufferAttrib
{
    constructor(gl: WebGL2RenderingContext, index: number, size: number, stride: number, offset: number)
    {
        super(gl, index, size, stride, offset);
    }

    use()
    {
        super.use();
        this.gl.vertexAttribDivisor(this.index, 1);
    }
}