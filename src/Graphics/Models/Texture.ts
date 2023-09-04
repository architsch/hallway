import { globalConfig } from "../../Config/GlobalConfig";
import AsyncLoadableObject from "../../Util/Async/AsyncLoadableObject";

export default class Texture extends AsyncLoadableObject
{
    private webGLTexture: WebGLTexture;

    protected static override async loadRoutine(id: string,
        options: {gl: WebGL2RenderingContext}): Promise<Texture>
    {
        console.log(`Started loading Texture (id = ${id})...`);

        const textureConfig = globalConfig.textureConfigById[id];
        if (textureConfig == undefined)
            throw new Error(`Texture config not found (id = ${id})`);
        const obj = new Texture();
        
        let textureLoaded = false;
        const gl = options.gl;
        const url = textureConfig.url;

        const image = new Image();
        image.onload = () => {
            obj.webGLTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, obj.webGLTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
            textureLoaded = true;
        };
        image.onerror = (event: Event | string) => {
            throw new Error(`Texture failed to load :: URL = ${url}, Event = ${event.toString()}`);
        };
        image.src = url;

        while (!textureLoaded)
            await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`Texture loaded :: ${id}`);
        return obj;
    }

    getWebGLTexture(): WebGLTexture
    {
        return this.webGLTexture;
    }
}