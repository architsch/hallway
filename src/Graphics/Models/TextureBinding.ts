import AsyncLoadableObject from "../../Util/Async/AsyncLoadableObject";
import Texture from "./Texture";

export default class TextureBinding extends AsyncLoadableObject
{
    private gl: WebGL2RenderingContext;
    private texture: Texture;
    private unit: number;
    private uniformLoc: WebGLUniformLocation;

    protected static override async loadRoutine(id: string,
        options: {gl: WebGL2RenderingContext, program: WebGLProgram, textureConfigId: string, unit: number}): Promise<TextureBinding>
    {
        const obj = new TextureBinding();

        obj.gl = options.gl;

        do
        {
            obj.texture = await Texture.get(options.textureConfigId, {gl: options.gl});
            await new Promise(resolve => setTimeout(resolve, 100));
        } while (obj.texture == undefined);

        obj.unit = options.unit;
        obj.uniformLoc = options.gl.getUniformLocation(options.program, `u_texture${options.unit}`);
        console.log(`TextureBinding loaded :: ${id}`);
        return obj;
    }

    use()
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.getWebGLTexture());
        this.gl.uniform1i(this.uniformLoc, this.unit);
    }

    unuse()
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
}