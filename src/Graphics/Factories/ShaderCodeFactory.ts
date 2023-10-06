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
out vec3 v_worldPos;
out vec3 v_worldNormal;
out vec3 v_cameraPos;

void main()
{
    ${(options.texturing == "color") ? "v_color = color;" : ""}
    ${(options.texturing == "texture") ? "v_uv = vec2(1.0 - uv[0], 1.0 - uv[1]);" : ""}
    ${(options.texturing == "texture") ? "v_uvScale = uvScale;" : ""}
    ${(options.texturing == "texture") ? "v_uvShift = uvShift;" : ""}

    ${(options.lighting == "diffuse") ? "vec3 worldNormal = (transpose(inverse(worldMat)) * vec4(normal, 1.0)).xyz;" : ""}
    ${(options.lighting == "diffuse") ? "v_worldNormal = worldNormal;" : ""}
    vec3 worldPos = (worldMat * vec4(position, 1.0)).xyz;
    v_worldPos = worldPos;
    v_cameraPos = u_cameraPos;

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
in vec3 v_worldPos;
in vec3 v_worldNormal;
in vec3 v_cameraPos;

out vec4 FragColor;

void main()
{
    ${(options.texturing == "color") ? "vec4 fragColor = vec4(v_color, 1.0);" : ""}
    ${(options.texturing == "texture") ? "vec2 uvAdjusted = mod(v_uv, vec2(1.0)) * v_uvScale + v_uvShift;" : ""}
    ${(options.texturing == "texture") ? "vec4 fragColor = texture(u_texture0, uvAdjusted);" : ""}
    ${(options.texturing == "texture") ? "if (fragColor.a < 0.25)" : ""}
    ${(options.texturing == "texture") ? "    discard;" : ""}

    vec3 toCamera = v_cameraPos - v_worldPos;
    float toCameraMag = length(toCamera);
    float fogFactor = clamp((50.0 - (toCameraMag - 7.0)) * 0.02, 0.0, 1.0);

    ${(options.lighting == "diffuse") ? "vec3 toLight = (v_cameraPos + vec3(0.0, 1.0, 0.0)) - v_worldPos;" : ""}
    ${(options.lighting == "diffuse") ? "float toLightMag = length(toLight);" : ""}
    ${(options.lighting == "diffuse") ? "float dirDiffuse = max(0.0, dot(normalize(v_worldNormal), toLight / (toLightMag + 0.001)));" : ""}
    ${(options.lighting == "diffuse") ? "float distDiffuse = max(0.0, 10.0 - toCameraMag) * 0.1;" : ""}
    ${(options.lighting == "diffuse") ? "float diffuse = 0.8 * dirDiffuse + 0.4 * distDiffuse + 0.3;" : ""}

    ${(options.lighting == "unlit") ? "FragColor = fragColor;" : ""}
    ${(options.lighting == "diffuse") ? "FragColor = vec4(diffuse * fogFactor * fragColor.rgb, 1.0);" : ""}
}`;
}

}