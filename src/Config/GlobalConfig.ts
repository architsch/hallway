import { mat4, vec2, vec3 } from "gl-matrix";
import { GlobalConfig } from "./ConfigTypes";

export const globalConfig: GlobalConfig = {
    textureConfigById: {
        "spriteAtlas": {
            url: "spriteAtlas.png",
        }
    },
    geometryConfigById: {
        "quad": {
            numVertices: 6,
            vertexAttribs: [
                {name: "position", type: "vec3", data: [
                    -0.5, -0.5, 0.0,
                    -0.5, +0.5, 0.0,
                    +0.5, -0.5, 0.0,
                    +0.5, +0.5, 0.0,
                    +0.5, -0.5, 0.0,
                    -0.5, +0.5, 0.0,
                ]},
                {name: "uv", type: "vec2", data: [
                    0, 0,
                    0, 1,
                    1, 0,
                    1, 1,
                    1, 0,
                    0, 1,
                ]},
            ],
            numInstances: 256,
            instanceAttribs: [
                {name: "model", type: "mat4", data: undefined},
                {name: "uvScale", type: "vec2", data: undefined},
                {name: "uvShift", type: "vec2", data: undefined},
            ],
        },
    },
    materialConfigById: {
        "sprite": {
            vertShaderBody: `
                out vec2 v_uv;

                void main()
                {
                    v_uv = uv * uvScale + uvShift;
                    gl_Position = u_cameraViewProj * model * vec4(position, 1.0);
                }
            `,
            fragShaderBody: `
                in vec2 v_uv;
                out vec4 FragColor;

                void main()
                {
                    vec4 fragColor = texture(u_texture0, v_uv);
                    if (fragColor.a < 0.5)
                        discard;
                    FragColor = vec4(fragColor.xyz, 1.0);
                }
            `,
            textureBindings: [
                {textureConfigId: "spriteAtlas", unit: 0},
            ],
            uniforms: [
                {name: "u_cameraViewProj", type: "mat4"},
            ],
        },
    },
    meshConfigById: {
        "spriteQuad": {
            geometryConfigId: "quad",
            materialConfigId: "sprite",
        },
    },
    entityConfigById: {
        "empty": {
        },
        "mainCamera": {
            "Camera": {
                fovy: ["number", 45 * Math.PI / 180],
                aspectRatio: ["number", 2],
                near: ["number", 0.1],
                far: ["number", 100],
                position: ["vec3", vec3.fromValues(0, 0, 10)],
                forward: ["vec3", vec3.fromValues(0, 0, -1)],
                up: ["vec3", vec3.fromValues(0, 1, 0)],
            }
        },
        "default": {
            "Transform": {
                position: ["vec3", vec3.fromValues(0, 0, 0)],
                rotation: ["vec3", vec3.fromValues(0, 0, 0)],
                scale: ["vec3", vec3.fromValues(1, 1, 1)],
            },
            "MeshInstance": {
                meshConfigId: ["string", "spriteQuad"],
                uvScale: ["vec2", vec2.fromValues(0.0625, 0.0625)],
                uvShift: ["vec2", vec2.fromValues(0, 0)],
            }
        }
    },
};