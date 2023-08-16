import GLTexture from "./GLTexture";

export default class TextureManager
{
    private gl: WebGL2RenderingContext;
    private textureById: {[id: string]: GLTexture};

    constructor(gl: WebGL2RenderingContext)
    {
        this.gl = gl;
        this.textureById = {};
    }

    async init()
    {
        let count = 0;
        let countTarget = 0;

        countTarget++; this.textureById["default"] = new GLTexture(this.gl, "default.png", () => count++);

        while (count < countTarget)
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
    }

    getTexture(id: string): GLTexture
    {
        return this.textureById[id];
    }
}