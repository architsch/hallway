import { mat4, vec2, vec3 } from "gl-matrix";
import { GlobalConfig } from "./ConfigTypes";

export const globalConfig: GlobalConfig = {
    geometryConfigById: {
        "quad": {
            numVertices: 6,
            vertexAttribs: [
                {name: "position", numFloats: 3, data: [
                    -0.5, -0.5, 0.0,
                    -0.5, +0.5, 0.0,
                    +0.5, -0.5, 0.0,
                    +0.5, +0.5, 0.0,
                    +0.5, -0.5, 0.0,
                    -0.5, +0.5, 0.0,
                ]},
                {name: "uv", numFloats: 2, data: [
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
                {name: "model_col0", numFloats: 4, data: undefined},
                {name: "model_col1", numFloats: 4, data: undefined},
                {name: "model_col2", numFloats: 4, data: undefined},
                {name: "model_col3", numFloats: 4, data: undefined},
                {name: "uvScale", numFloats: 2, data: undefined},
                {name: "uvShift", numFloats: 2, data: undefined},
            ],
        },
    },
    materialConfigById: {
        "sprite": {
            vertShaderBody: `
                out vec2 v_uv;

                void main()
                {
                    mat4 model = mat4(model_col0, model_col1, model_col2, model_col3);
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
            textures: [
                {url: "spriteAtlas.png", unit: 0},
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