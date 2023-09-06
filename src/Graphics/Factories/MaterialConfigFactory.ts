import { MaterialConfig } from "../../Config/ConfigTypes";
import ShadingOptions from "../Models/ShadingOptions";
import ShaderCodeFactory from "./ShaderCodeFactory";

export default class MaterialConfigFactory
{
    static make(options: ShadingOptions): MaterialConfig
    {
        return {
            vertShaderBody: ShaderCodeFactory.vertShaderBody(options),
            fragShaderBody: ShaderCodeFactory.fragShaderBody(options),
            textureBindings: this.makeTextureBindings(options),
            uniforms: this.makeUniforms(options),
        };
    }

    private static makeTextureBindings(options: ShadingOptions): {textureConfigId: string, unit: number}[]
    {
        const textureBindings: {textureConfigId: string, unit: number}[] = [];

        if (options.texturing == "texture")
            textureBindings.push({textureConfigId: "spriteAtlas", unit: 0});

        return textureBindings;
    }

    private static makeUniforms(options: ShadingOptions): {configId: string, usedByVertShader: boolean, usedByFragShader: boolean}[]
    {
        const uniforms: {configId: string, usedByVertShader: boolean, usedByFragShader: boolean}[] = [];
        
        uniforms.push({configId: "u_cameraViewProj", usedByVertShader: true, usedByFragShader: false});
        if (options.lighting == "diffuse")
        {
            uniforms.push({configId: "u_ambLightColor", usedByVertShader: true, usedByFragShader: false});
            uniforms.push({configId: "u_ambLightIntensity", usedByVertShader: true, usedByFragShader: false});
            uniforms.push({configId: "u_spotLightPosition", usedByVertShader: true, usedByFragShader: false});
            uniforms.push({configId: "u_spotLightColor", usedByVertShader: true, usedByFragShader: false});
            uniforms.push({configId: "u_spotLightIntensity", usedByVertShader: true, usedByFragShader: false});
        }

        return uniforms;
    }
}