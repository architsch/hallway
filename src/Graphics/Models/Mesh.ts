import GLBuffer from "./GLBuffer";
import Shader from "./Shader";
import Texture from "./Texture";
import { Uniform, UniformFloat, UniformMat2, UniformMat3, UniformMat4, UniformVec2, UniformVec3, UniformVec4 } from "./Uniform";
import { globalConfig } from "../../Config/GlobalConfig";

const meshCache: {[meshConfigId: string]: Mesh} = {};

export default class Mesh
{
    private shader: Shader;
    private vertexBuffers: GLBuffer[];
    private uniforms: {[name: string]: Uniform<any>};
    private textures: Texture[];

    private constructor() {}

    static get(meshConfigId: string): Mesh | null
    {
        if (meshCache[meshConfigId] != undefined)
            return meshCache[meshConfigId];
        else
            return null;
    }

    static async load(gl: WebGL2RenderingContext, meshConfigId: string): Promise<Mesh>
    {
        if (meshCache[meshConfigId] != undefined)
        {
            return meshCache[meshConfigId];
        }
        else
        {
            const meshConfig = globalConfig.meshConfigById[meshConfigId];
            const meshObject = new Mesh();

            meshObject.shader = new Shader(gl, meshConfig);
            const program = meshObject.shader.getProgram();

            meshObject.vertexBuffers = [];
            for (const vertexAttrib of meshConfig.vertexAttribs)
                meshObject.vertexBuffers.push(new GLBuffer(gl, program, gl.ARRAY_BUFFER, gl.STATIC_DRAW, vertexAttrib));

            meshObject.uniforms = {};
            for (const uniform of meshConfig.uniforms)
            {
                if (meshObject.uniforms[uniform.name] != undefined)
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
                meshObject.uniforms[uniform.name] = uniformObject;
            }

            meshObject.textures = [];
            for (const texture of meshConfig.textures)
            {
                const textureObject = await Texture.load(gl, program, texture.url, texture.unit);
                meshObject.textures.push(textureObject);
            }
            meshCache[meshConfigId] = meshObject;
            return meshObject;
        }
    }

    use()
    {
        this.shader.use();
        
        for (const vertexBuffer of this.vertexBuffers)
            vertexBuffer.use();

        for (const texture of this.textures)
            texture.use();
    }

    updateUniform(name: string, value: any)
    {
        if (this.uniforms[name] == undefined)
            throw new Error(`Uniform name "${name}" doesn't exist.`);
        this.uniforms[name].updateValue(value);
    }
}