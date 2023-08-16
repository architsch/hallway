import GLBuffer from "./GLBuffer";

export default class GLInstanceBuffer extends GLBuffer
{
    constructor(gl: WebGL2RenderingContext, numStrides: number, attribSizes: Array<number>)
    {
        super(gl, gl.ARRAY_BUFFER, numStrides, attribSizes, gl.DYNAMIC_DRAW, false, true);
    }
}