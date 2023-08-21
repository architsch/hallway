import { vec2 } from "gl-matrix";
import { GlobalConfig } from "./ConfigTypes";

export const globalConfig: GlobalConfig = {
    meshConfigById: {
        "spriteQuad": {
            vertShaderBody: `
                out vec2 v_uv;

                void main()
                {
                    v_uv = uv * u_uvScale + u_uvShift;
                    gl_Position = u_cameraViewProj * u_model * position;
                }
            `,
            fragShaderBody: `
                in vec2 v_uv;
                out vec4 FragColor;

                void main()
                {
                    FragColor = texture2d(u_texture0, v_uv);
                }
            `,
            textures: [
                {url: "spriteAtlas.png", unit: 0},
            ],
            uniforms: [
                {name: "u_cameraViewProj", type: "mat4"},
                {name: "u_model", type: "mat4"},
                {name: "u_uvScale", type: "vec2"},
                {name: "u_uvShift", type: "vec2"},
            ],
            vertexAttribs: [
                {name: "position", numFloats: 3, data: [
                    -0.5, -0.5, 0.0,
                    -0.5, +0.5, 0.0,
                    +0.5, -0.5, 0.0,
                    +0.5, +0.5, 0.0,
                    +0.5, -0.5, 0.0,
                    -0.5, +0.5, 0.0,
                ]},
                {name: "normal", numFloats: 3, data: [
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
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
        }
    },
    entityConfigById: {
        "empty": {
        },
        "default": {
            "MeshInstance": {
                meshId: ["string", "spriteQuad"],
                uvScale: ["vec2", vec2.fromValues(0.0625, 0.0625)],
                uvShift: ["vec2", vec2.fromValues(0, 0)],
            }
        }
    },
};