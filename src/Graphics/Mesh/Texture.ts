const textureCache: {[url: string]: WebGLTexture} = {};

export default class Texture
{
    private gl: WebGL2RenderingContext;
    private texture: WebGLTexture;
    private unit: number;
    private uniformLoc: WebGLUniformLocation;

    private constructor() {}

    static async load(gl: WebGL2RenderingContext, program: WebGLProgram, url: string, unit: number): Promise<Texture>
    {
        const textureObject = new Texture();
        let textureLoaded = false;

        textureObject.gl = gl;
        textureObject.unit = unit;
        textureObject.uniformLoc = gl.getUniformLocation(program, `u_texture${unit}`);

        if (textureCache[url] != undefined)
        {
            textureObject.texture = textureCache[url];
            textureLoaded = true;
        }
        else
        {
            const image = new Image();
            image.onload = () => {
                textureObject.texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, textureObject.texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
                textureCache[url] = textureObject.texture;
                textureLoaded = true;
            };
            image.onerror = (event: Event | string) => {
                throw new Error(`Texture failed to load :: URL = ${url}`);
            };
            image.src = url;
        }

        while (!textureLoaded)
            await new Promise(resolve => setTimeout(resolve, 100));
        
        return textureObject;
    }

    getTexture(): WebGLTexture
    {
        return this.texture;
    }

    use()
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.uniformLoc, this.unit);
    }
}