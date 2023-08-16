import GLShader from "./GLShader";

export default class ShaderManager
{
    private gl: WebGL2RenderingContext;
    private shaderById: {[id: string]: GLShader};
    
    constructor(gl: WebGL2RenderingContext)
    {
        this.gl = gl;
        this.shaderById = {};

        this.shaderById["default"] = new GLShader(gl,
        `
            precision mediump float;

            // Vertex Attributes
            layout(location=0) attribute vec3 position;
            layout(location=1) attribute vec2 uv;

            // Instance Attributes
            layout(location=0) attribute vec2 uvScale;
            layout(location=1) attribute vec2 uvShift;
            layout(location=2) attribute vec3 modelTranslation;
            layout(location=3) attribute vec3 modelScaleAndAngle;

            uniform mat4 u_cameraViewProj;

            varying vec2 v_uv;

            void main()
            {
                v_uv = uv * uvScale + uvShift;

                vec3 posScaled = vec3(
                    position.x * modelScaleAndAngle.x,
                    position.y * modelScaleAndAngle.y,
                    position.z * modelScaleAndAngle.z
                );

                float angle = modelScaleAndAngle.w;
                float angleCos = cos(angle);
                float angleSin = sin(angle);

                vec3 posScaledAndRotated = vec3(
                    posScaled.x * angleSin + posScaled.y * angleCos,
                    -posScaled.x * angleCos + posScaled.y * angleSin,
                    posScaled.z
                );
                
                gl_Position = u_cameraViewProj * vec4(
                    posScaledAndRotated.x + modelTranslation.x,
                    posScaledAndRotated.y + modelTranslation.y,
                    posScaledAndRotated.z + modelTranslation.z,
                    1.0);
            }
        `,
        `
            precision mediump float;

            uniform sampler2D u_mainTex;

            varying vec2 v_uv;

            void main()
            {
                vec4 texColor = texture2D(u_mainTex, v_uv);
                gl_FragColor = texColor;
            }
        `);
        
    }

    getShader(id: string): GLShader
    {
        return this.shaderById[id];
    }
}