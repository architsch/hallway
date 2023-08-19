import GLBufferAttrib from "./GLBufferAttrib";

export default class GLBuffer
{
    protected gl: WebGL2RenderingContext;
    protected target: number;
    protected usage: number;

    protected buffer: WebGLBuffer;
    protected attrib: GLBufferAttrib;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, target: number, usage: number,
        attrib: {name: string, numFloats: number, data: number[]})
    {
        this.gl = gl;
        this.target = target;
        this.usage = usage;

        this.attrib = new GLBufferAttrib(gl, gl.getAttribLocation(program, attrib.name), attrib.numFloats, 0, 0);

        this.buffer = gl.createBuffer();
        const data = new Float32Array(attrib.data.length);
        for (let i = 0; i < attrib.data.length; ++i)
            data[i] = attrib.data[i];
        gl.bufferData(target, data, usage);
    }

    use()
    {
        this.gl.bindBuffer(this.target, this.buffer);
        this.attrib.use();
    }
}