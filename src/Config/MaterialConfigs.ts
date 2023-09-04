import { MaterialConfig } from "./ConfigTypes";

export const materialConfigById: {[id: string]: MaterialConfig} = {
    "unlit": {
        vertShaderBody: `
            out vec2 v_uv;
            out vec3 v_color;

            void main()
            {
                v_uv = uv * uvScale + uvShift;
                v_color = color;
                // Note: "normal * 0.0" is for preventing the shader compiler from omitting the 'normal' attrib.
                gl_Position = u_cameraViewProj * model * vec4(position + normal * 0.0, 1.0);
            }
        `,
        fragShaderBody: `
            in vec2 v_uv;
            in vec3 v_color;
            out vec4 FragColor;

            void main()
            {
                vec4 fragColor = texture(u_texture0, v_uv) * vec4(v_color, 1.0);
                if (fragColor.a < 0.5)
                    discard;
                FragColor = vec4(fragColor.xyz, 1.0);
            }
        `,
        textureBindings: [
            {textureConfigId: "spriteAtlas", unit: 0},
        ],
        uniforms: [
            {configId: "u_cameraViewProj", usedByVertShader: true, usedByFragShader: false},
        ],
    },
    "diffuse": {
        vertShaderBody: `
            out vec2 v_uv;
            out vec3 v_color;
            out vec3 v_worldNormal;
            out vec3 v_worldPos;

            void main()
            {
                v_uv = uv * uvScale + uvShift;
                v_color = color;
                v_worldNormal = (transpose(inverse(model)) * vec4(normal, 1.0)).xyz;
                v_worldPos = (model * vec4(position, 1.0)).xyz;
                gl_Position = u_cameraViewProj * vec4(v_worldPos, 1.0);
            }
        `,
        fragShaderBody: `
            in vec2 v_uv;
            in vec3 v_color;
            in vec3 v_worldNormal;
            in vec3 v_worldPos;
            out vec4 FragColor;

            void main()
            {
                vec4 fragColor = texture(u_texture0, v_uv) * vec4(v_color, 1.0);
                if (fragColor.a < 0.5)
                    discard;

                // Ambient Lighting
                vec3 ambient = u_ambLightIntensity * u_ambLightColor * fragColor.xyz;

                // Diffuse Lighting
                vec3 toSpotLight = u_spotLightPosition - v_worldPos;
                float diffuseFactor = max(0.0, dot(normalize(v_worldNormal), normalize(toSpotLight)));
                vec3 diffuse = u_spotLightIntensity * u_spotLightColor * diffuseFactor * fragColor.xyz;

                FragColor = vec4(ambient + diffuse, 1.0);
            }
        `,
        textureBindings: [
            {textureConfigId: "spriteAtlas", unit: 0},
        ],
        uniforms: [
            {configId: "u_cameraViewProj", usedByVertShader: true, usedByFragShader: false},
            {configId: "u_ambLightColor", usedByVertShader: false, usedByFragShader: true},
            {configId: "u_ambLightIntensity", usedByVertShader: false, usedByFragShader: true},
            {configId: "u_spotLightPosition", usedByVertShader: false, usedByFragShader: true},
            {configId: "u_spotLightColor", usedByVertShader: false, usedByFragShader: true},
            {configId: "u_spotLightIntensity", usedByVertShader: false, usedByFragShader: true},
        ],
    },
};