import { globalConfig } from "../../Config/GlobalConfig";
import AsyncLoadableObject from "../../Util/Async/AsyncLoadableObject";
import Shader from "./Shader";
import Texture from "./Texture";
import { Uniform, UniformFloat, UniformMat2, UniformMat3, UniformMat4, UniformVec2, UniformVec3, UniformVec4 } from "./Uniform";

export default class Material extends AsyncLoadableObject
{
    private shader: Shader;
    private uniforms: {[name: string]: Uniform<any>};
    private textures: Texture[];

    protected static override async loadRoutine(id: string,
        options: {gl: WebGL2RenderingContext, geometryConfigId: string}): Promise<any>
    {
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
            if (obj.uniforms[uniform.name] != undefined)
                throw new Error(`Duplicate uniform name found :: ${uniform.name}`);
            
            let uniformObject: Uniform<any>;
            switch (uniform.type)
            {
                case "float": uniformObject = new UniformFloat(gl, program, uniform.name); break;
                case "vec2": uniformObject = new UniformVec2(gl, program, uniform.name); break;
                case "vec3": uniformObject = new UniformVec3(gl, program, uniform.name); break;
                case "vec4": uniformObject = new UniformVec4(gl, program, uniform.name); break;
                case "mat2": uniformObject = new UniformMat2(gl, program, uniform.name); break;
                case "mat3": uniformObject = new UniformMat3(gl, program, uniform.name); break;
                case "mat4": uniformObject = new UniformMat4(gl, program, uniform.name); break;
                default: throw new Error(`Unhandled uniform type :: ${uniform.type} (name: ${uniform.name})`); break;
            }
            obj.uniforms[uniform.name] = uniformObject;
        }

        obj.textures = [];
        for (const texture of materialConfig.textures)
        {
            const textureObject = await Texture.load(gl, program, texture.url, texture.unit);
            obj.textures.push(textureObject);
        }

        return obj;
    }

    use()
    {
        this.shader.use();

        for (const texture of this.textures)
            texture.use();
    }

    updateUniform(name: string, value: any)
    {
        if (this.uniforms[name] == undefined)
            throw new Error(`Uniform name "${name}" doesn't exist.`);
        this.uniforms[name].updateValue(value);
    }

    getProgram(): WebGLProgram
    {
        return this.shader.getProgram();
    }
}