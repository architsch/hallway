import GLShader from "./GLShader";
import GLTexture from "./GLTexture";

export default class GLMaterial
{
    private glShader: GLShader;
    private glTexture: GLTexture;

    constructor(glShader: GLShader, glTexture: GLTexture)
    {
        this.glShader = glShader;
        this.glTexture = glTexture;
    }

    use()
    {
        this.glShader.use();
        this.glTexture.use(this.glShader.getUniformLoc("u_mainTex"));
    }

    updateUniform(name: string, value: any)
    {
        this.glShader.updateUniform(name, value);
    }
}