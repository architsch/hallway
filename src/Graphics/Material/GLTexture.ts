export default class GLTexture
{
    private gl: WebGL2RenderingContext;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, url: string, onLoad: () => void)
    {
        this.gl = gl;

        const image = new Image();
        image.onload = () => {
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            onLoad();
        };
        image.src = url;
    }

    use(uniformLoc: WebGLUniformLocation)
    {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(uniformLoc, 0);
    }
}