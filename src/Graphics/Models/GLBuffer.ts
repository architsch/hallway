import GLBufferAttrib from "./GLBufferAttrib";

export default class GLBuffer
{
    protected gl: WebGL2RenderingContext;
    protected target: number;
    protected usage: number;
    protected floatStride: number;

    protected buffer: WebGLBuffer;
    protected bufferDataCache: Float32Array;
    protected bufferDataCacheDirty: boolean;
    protected attribs: GLBufferAttrib[];

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, target: number, usage: number,
        numStrides: number,
        attribs: {name: string, numFloats: number, data: number[]}[],
        instanced: boolean)
    {
        this.gl = gl;
        this.target = target;
        this.usage = usage;

        this.buffer = gl.createBuffer();

        let stride = 0;
        for (const attrib of attribs)
            stride += attrib.numFloats * 4; // 4 = bytes per Float32
        this.floatStride = stride / 4;

        let offset = 0;
        this.attribs = new Array<GLBufferAttrib>(attribs.length);
        this.bufferDataCache = new Float32Array(numStrides * (stride / 4));
        this.bufferDataCacheDirty = true;

        for (let i = 0; i < attribs.length; ++i)
        {
            const attrib = attribs[i];
            const index = gl.getAttribLocation(program, attrib.name);
            if (index < 0)
                throw new Error(`Attrib location not found (attrib name = ${attrib.name})`);
            this.attribs[i] = new GLBufferAttrib(gl, index, attrib.numFloats, stride, offset, instanced);

            const floatOffset = offset / 4;
            for (let strideIndex = 0; strideIndex < numStrides; ++strideIndex)
            {
                for (let j = 0; j < attrib.numFloats; ++j)
                {
                    this.bufferDataCache[floatOffset + (this.floatStride * strideIndex) + j] =
                        (attrib.data == undefined) ? 0 : attrib.data[(strideIndex * attrib.numFloats) + j];
                }
            }
            offset += attrib.numFloats * 4; // 4 = bytes per Float32
        }
    }

    use()
    {
        this.gl.bindBuffer(this.target, this.buffer);

        if (this.bufferDataCacheDirty)
        {
            this.gl.bufferData(this.target, this.bufferDataCache, this.usage);
            this.bufferDataCacheDirty = false;
        }

        for (const attrib of this.attribs)
            attrib.use();
    }

    setDataAtStrideIndex(strideIndex: number, data: Float32Array)
    {
        if (data.length != this.floatStride)
            throw new Error(`Data size mismatch :: (floatStride = ${this.floatStride}, data.length = ${data.length})`);
        for (let i = 0; i < this.floatStride; ++i)
            this.bufferDataCache[strideIndex * this.floatStride + i] = data[i];
        this.bufferDataCacheDirty = true;
    }
}