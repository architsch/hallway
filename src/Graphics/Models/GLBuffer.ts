import GLBufferAttrib from "./GLBufferAttrib";

export default class GLBuffer
{
    protected gl: WebGL2RenderingContext;
    protected target: number;
    protected usage: number;

    protected buffer: WebGLBuffer;
    protected attrib: GLBufferAttrib;

    protected numStrides: number;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, target: number, usage: number,
        attrib: {name: string, numFloats: number, data: number[]})
    {
        this.gl = gl;
        this.target = target;
        this.usage = usage;

        const index = gl.getAttribLocation(program, attrib.name);
        if (index < 0)
            throw new Error(`Attrib location not found (attrib name = ${attrib.name})`);
        this.attrib = new GLBufferAttrib(gl, index, attrib.numFloats, 0, 0);

        this.buffer = gl.createBuffer();
        gl.bindBuffer(target, this.buffer);
        
        const data = new Float32Array(attrib.data.length);
        for (let i = 0; i < attrib.data.length; ++i)
            data[i] = attrib.data[i];
        gl.bufferData(target, data, usage);

        this.numStrides = data.length / attrib.numFloats;
    }

    use()
    {
        this.gl.bindBuffer(this.target, this.buffer);
        this.attrib.use();
    }

    getNumStrides(): number
    {
        return this.numStrides;
    }
}