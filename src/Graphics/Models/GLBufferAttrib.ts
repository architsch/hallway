export default class GLBufferAttrib
{
    protected gl: WebGL2RenderingContext;

    protected type: string;
    protected index: number;
    protected size: number;
    protected stride: number;
    protected offset: number;
    protected instanced: boolean;

    protected subsize: number;

    constructor(gl: WebGL2RenderingContext, type: string, index: number, size: number, stride: number, offset: number, instanced: boolean)
    {
        this.gl = gl;
        this.type = type;
        this.index = index;
        this.size = size;
        this.stride = stride;
        this.offset = offset;
        this.instanced = instanced;

        if (index < 0)
            throw new Error(`Invalid attrib index (index = ${index})`);
        
        switch (type)
        {
            case "mat2": this.subsize = this.size / 2; break;
            case "mat3": this.subsize = this.size / 3; break;
            case "mat4": this.subsize = this.size / 4; break;
            default: this.subsize = this.size; break;
        }
    }

    use()
    {
        let ind = this.index;
        for (let suboffset = 0; suboffset < this.size; suboffset += this.subsize)
        {
            this.gl.enableVertexAttribArray(ind);
            this.gl.vertexAttribPointer(ind, this.subsize, this.gl.FLOAT, false, this.stride, this.offset + 4*suboffset);
            if (this.instanced)
                this.gl.vertexAttribDivisor(ind, 1);
            ++ind;
        }
    }
}