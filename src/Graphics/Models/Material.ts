import { globalConfig } from "../../Config/GlobalConfig";
import AsyncLoadableObject from "../../Util/Async/AsyncLoadableObject";
import Shader from "./Shader";
import TextureBinding from "./TextureBinding";
import { Uniform, UniformFloat, UniformMat2, UniformMat3, UniformMat4, UniformVec2, UniformVec3, UniformVec4 } from "./Uniform";

export default class Material extends AsyncLoadableObject
{
    private shader: Shader;
    private uniforms: {[configId: string]: Uniform<any>};
    private textureBindings: TextureBinding[];

    protected static override async loadRoutine(id: string,
        options: {gl: WebGL2RenderingContext, geometryConfigId: string}): Promise<Material>
    {
        console.log(`Started loading Material (id = ${id})...`);

        const materialConfig = globalConfig.materialConfigById[id];
        if (materialConfig == undefined)
            throw new Error(`MaterialConfig not found (materialConfigId = ${id})`);
    
        const gl = options.gl;
        const geometryConfigId = options.geometryConfigId;

        const geometryConfig = globalConfig.geometryConfigById[geometryConfigId];
        if (geometryConfig == undefined)
            throw new Error(`GeometryConfig not found (geometryConfigId = ${geometryConfigId})`);

        const obj = new Material();
        obj.shader = new Shader(gl, geometryConfig, materialConfig);
        const program = obj.shader.getProgram();

        obj.uniforms = {};
        for (const uniform of materialConfig.uniforms)
        {
            if (obj.uniforms[uniform.configId] != undefined)
                throw new Error(`Duplicate uniform configId found :: ${uniform.configId}`);

            const uniformConfig = globalConfig.uniformConfigById[uniform.configId];
            if (uniformConfig == undefined)
                throw new Error(`Uniform config not found (id = ${uniform.configId})`);
            
            let uniformObject: Uniform<any>;
            switch (uniformConfig.type)
            {
                case "float": uniformObject = new UniformFloat(gl, program, uniform.configId); break;
                case "vec2": uniformObject = new UniformVec2(gl, program, uniform.configId); break;
                case "vec3": uniformObject = new UniformVec3(gl, program, uniform.configId); break;
                case "vec4": uniformObject = new UniformVec4(gl, program, uniform.configId); break;
                case "mat2": uniformObject = new UniformMat2(gl, program, uniform.configId); break;
                case "mat3": uniformObject = new UniformMat3(gl, program, uniform.configId); break;
                case "mat4": uniformObject = new UniformMat4(gl, program, uniform.configId); break;
                default: throw new Error(`Unhandled uniform type :: ${uniformConfig.type} (configId: ${uniform.configId})`); break;
            }
            obj.uniforms[uniform.configId] = uniformObject;
        }

        obj.textureBindings = new Array<TextureBinding>(materialConfig.textureBindings.length);
        for (let i = 0; i < materialConfig.textureBindings.length; ++i)
        {
            const textureBinding = materialConfig.textureBindings[i];
            const textureBindingId = `${id}_textureBinding_${i}`;
            do
            {
                obj.textureBindings[i] = TextureBinding.get(textureBindingId, {gl, program, textureConfigId: textureBinding.textureConfigId, unit: textureBinding.unit});
                await new Promise(resolve => setTimeout(resolve, 100));
            } while (obj.textureBindings[i] == undefined);
        }
        console.log(`Material loaded :: ${id}`);
        return obj;
    }

    use()
    {
        this.shader.use();
        for (const texture of this.textureBindings)
            texture.use();
    }

    unuse()
    {
        this.shader.unuse();
        for (const texture of this.textureBindings)
            texture.unuse();
    }

    updateUniform(configId: string, value: any)
    {
        if (this.uniforms[configId] == undefined)
            throw new Error(`Uniform with configId "${configId}" doesn't exist.`);
        this.uniforms[configId].updateValue(value);
    }

    getUniforms(): {[configId: string]: Uniform<any>}
    {
        return this.uniforms;
    }

    getProgram(): WebGLProgram
    {
        return this.shader.getProgram();
    }
}