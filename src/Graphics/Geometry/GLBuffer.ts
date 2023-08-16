import GLBufferAttrib from "./GLBufferAttrib";
import GLInstanceBufferAttrib from "./GLInstanceBufferAttrib";

export default abstract class GLBuffer
{
    protected gl: WebGL2RenderingContext;
    protected target: number;
    protected attribOffsets: Array<number>;
    protected attribs: Array<GLBufferAttrib>;
    protected attribStride: number;
    protected buffer: WebGLBuffer;
    protected bufferDataArray: Float32Array;
    protected updateIsInstant: boolean;
    protected usage: number;

    constructor(gl: WebGL2RenderingContext, target: number, numStrides: number, attribSizes: Array<number>, usage: number, updateIsInstant: boolean, useInstancing: boolean)
    {
        this.gl = gl;
        this.target = target;
        
        this.attribOffsets = new Array<number>(attribSizes.length);
        this.attribs = new Array<GLBufferAttrib>(attribSizes.length);
        let bytesSum = 0;
        for (let i = 0; i < attribSizes.length; ++i)
        {
            const bytes = 4 * attribSizes[i]; // 4 = number of bytes per float
            bytesSum += bytes;
        }
        let bytesCumulativeSum = 0;
        for (let i = 0; i < attribSizes.length; ++i)
        {
            const bytes = 4 * attribSizes[i]; // 4 = number of bytes per float
            this.attribs[i] = useInstancing ?
                new GLInstanceBufferAttrib(gl, i, attribSizes[i], bytesSum, bytesCumulativeSum) :
                new GLBufferAttrib(gl, i, attribSizes[i], bytesSum, bytesCumulativeSum);
            this.attribOffsets[i] = bytesCumulativeSum;
            bytesCumulativeSum += bytes;
        }
        this.attribStride = bytesSum;

        this.buffer = gl.createBuffer();
        this.bufferDataArray = new Float32Array(numStrides * (this.attribStride / 4));
        this.updateIsInstant = updateIsInstant;

        gl.bindBuffer(target, this.buffer);
        gl.bufferData(target, this.bufferDataArray.byteLength, usage);
    }

    use()
    {
        this.gl.bindBuffer(this.target, this.buffer);
        for (let i = 0; i < this.attribs.length; ++i)
            this.attribs[i].use();
    
        if (!this.updateIsInstant)
            this.gl.bufferData(this.target, this.bufferDataArray, this.usage);
    }

    clearData(clearValue: number)
    {
        for (let i = 0; i < this.bufferDataArray.length; ++i)
            this.bufferDataArray[i] = clearValue;
    }

    setData(data: Float32Array)
    {
        if (this.updateIsInstant)
        {
            this.gl.bindBuffer(this.target, this.buffer);
            this.gl.bufferData(this.target, data, this.usage);
        }
        else
        {
            for (let i = 0; i < data.length; ++i)
                this.bufferDataArray[i] = data[i];
        }
    }

    setDataAt(strideIndex: number, data: Float32Array)
    {
        if (this.updateIsInstant)
        {
            this.gl.bindBuffer(this.target, this.buffer);
            this.gl.bufferSubData(this.target, strideIndex * this.attribStride, data);
        }
        else
        {
            const start = strideIndex * this.attribStride / 4;
            for (let i = 0; i < data.length; ++i)
                this.bufferDataArray[start + i] = data[i];
        }
    }
}