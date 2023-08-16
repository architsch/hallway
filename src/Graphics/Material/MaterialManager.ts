import TextureManager from "./TextureManager";
import ShaderManager from "./ShaderManager";
import GLMaterial from "./GLMaterial";

export default class MaterialManager
{
    private gl: WebGL2RenderingContext;
    private shaderManager: ShaderManager;
    private textureManager: TextureManager;

    private materialById: {[id: string]: GLMaterial};
    
    constructor(gl: WebGL2RenderingContext)
    {
        this.gl = gl;
        this.shaderManager = new ShaderManager(gl);
        this.textureManager = new TextureManager(gl);
        
        this.materialById = {};
        
    }

    async init()
    {
        await this.textureManager.init();

        this.materialById["default"] = new GLMaterial(this.shaderManager.getShader("default"), this.textureManager.getTexture("default"));
    }

    getMaterial(id: string): GLMaterial
    {
        return this.materialById[id];
    }
}