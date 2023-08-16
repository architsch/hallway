import GLBuffer from "./GLBuffer";

export default class GLVertexBuffer extends GLBuffer
{
    constructor(gl: WebGL2RenderingContext, numStrides: number, attribSizes: Array<number>)
    {
        super(gl, gl.ARRAY_BUFFER, numStrides, attribSizes, gl.STATIC_DRAW, false, false);
    }
}