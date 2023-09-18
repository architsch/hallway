import ShadingOptions from "../Models/ShadingOptions";

export default class ShaderCodeFactory
{

//---------------------------------------------------------------------------------
// Vert Shader
//---------------------------------------------------------------------------------
static vertShaderBody(options: ShadingOptions): string
{
return `
${(options.texturing == "color") ? "out vec3 v_color;" : ""}
${(options.texturing == "texture") ? "out vec2 v_uv;" : ""}
${(options.texturing == "texture") ? "out vec2 v_uvScale;" : ""}
${(options.texturing == "texture") ? "out vec2 v_uvShift;" : ""}
${(options.lighting == "diffuse") ? "out vec3 v_ambient;" : ""}
${(options.lighting == "diffuse") ? "out vec3 v_diffuse;" : ""}

void main()
{
    ${(options.texturing == "color") ? "v_color = color;" : ""}
    ${(options.texturing == "texture") ? "v_uv = uv;" : ""}
    ${(options.texturing == "texture") ? "v_uvScale = uvScale;" : ""}
    ${(options.texturing == "texture") ? "v_uvShift = uvShift;" : ""}

    ${(options.lighting == "diffuse") ? "vec3 worldNormal = (transpose(inverse(worldMat)) * vec4(normal, 1.0)).xyz;" : ""}
    vec3 worldPos = (worldMat * vec4(position, 1.0)).xyz;

    ${(options.lighting == "diffuse") ? "v_ambient = u_ambLightIntensity * u_ambLightColor;" : ""}
    ${(options.lighting == "diffuse") ? "vec3 toSpotLight = u_spotLightPosition - worldPos;" : ""}
    ${(options.lighting == "diffuse") ? "float diffuseFactor = max(0.0, dot(normalize(worldNormal), normalize(toSpotLight)));" : ""}
    ${(options.lighting == "diffuse") ? "v_diffuse = u_spotLightIntensity * u_spotLightColor * diffuseFactor;" : ""}

    gl_Position = u_cameraViewProj * vec4(worldPos, 1.0);
}`;
}

//---------------------------------------------------------------------------------
// Frag Shader
//---------------------------------------------------------------------------------
static fragShaderBody(options: ShadingOptions): string
{
return `
${(options.texturing == "color") ? "in vec3 v_color;" : ""}
${(options.texturing == "texture") ? "in vec2 v_uv;" : ""}
${(options.texturing == "texture") ? "in vec2 v_uvScale;" : ""}
${(options.texturing == "texture") ? "in vec2 v_uvShift;" : ""}
${(options.lighting == "diffuse") ? "in vec3 v_ambient;" : ""}
${(options.lighting == "diffuse") ? "in vec3 v_diffuse;" : ""}
out vec4 FragColor;

void main()
{
    ${(options.texturing == "color") ? "vec4 fragColor = vec4(v_color, 1.0);" : ""}
    ${(options.texturing == "texture") ? "vec2 uvAdjusted = mod(v_uv, vec2(1.0)) * v_uvScale + v_uvShift;" : ""}
    ${(options.texturing == "texture") ? "vec4 fragColor = texture(u_texture0, uvAdjusted);" : ""}
    ${(options.texturing == "texture") ? "if (fragColor.a < 0.5)" : ""}
    ${(options.texturing == "texture") ? "    discard;" : ""}

    ${(options.lighting == "unlit") ? "FragColor = fragColor;" : ""}
    ${(options.lighting == "diffuse") ? "FragColor = vec4((v_ambient + v_diffuse) * fragColor.rgb, 1.0);" : ""}
}`;
}

}