import { vec3 } from "gl-matrix";
import ECSManager from "../../ECS/ECSManager";
import Entity from "../../ECS/Entity";
import System from "../../ECS/System";
import { ColliderComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";
import { GraphicsComponent } from "../Models/GraphicsComponents";
import { globalConfig } from "../../Config/GlobalConfig";
import { Component } from "../../ECS/Component";

export default class ColliderRenderSystem extends System
{
    private floatsPerVertex = 3;
    private verticesPerCube = 24;
    private maxNumCubesPerDraw = 64;
    private verticesData: Float32Array = new Float32Array(this.floatsPerVertex * this.verticesPerCube * this.maxNumCubesPerDraw);

    private initialized: boolean = false;
    private vertexBuffer: WebGLBuffer;
    private program: WebGLProgram;
    
    private floatsPending: number = 0;

    private boundingBoxHalfSize: vec3 = vec3.create();
    
    getCriteria(): [groupId: string, requiredComponentTypes: string[]][]
    {
        return [
            ["Collider", ["Transform", "Collider"]],
        ];
    }

    start(ecs: ECSManager)
    {
    }
    
    update(ecs: ECSManager, t: number, dt: number)
    {
        const graphicsComponent = ecs.singletonComponents().get("Graphics") as GraphicsComponent;
        const gl = graphicsComponent.gl;

        if (!this.initialized)
        {
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.verticesData, gl.DYNAMIC_DRAW);

            const vertCode =`#version 300 es
in vec3 position;
uniform mat4 u_cameraViewProj;
out vec3 v_position;

void main()
{
    v_position = position;
    gl_Position = u_cameraViewProj * vec4(position, 1.0);
}
`;
            const vertShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertShader, vertCode);
            gl.compileShader(vertShader);
            let infoLog = gl.getShaderInfoLog(vertShader);
            if (infoLog.length > 0)
                throw new Error(`VERTEX SHADER ERROR :: ${infoLog}`);

            const fragCode =`#version 300 es
precision highp float;
uniform vec3 u_cameraPosition;
in vec3 v_position;
out vec4 FragColor;

void main()
{
    float dist = length(v_position - u_cameraPosition);
    float intensity = max(0.0, 1.0 - dist * 0.025);
    float nx = floor(gl_FragCoord.x);
    float ny = floor(gl_FragCoord.y);
    if (intensity <= 0.55 && mod(nx, 2.0) > 0.001 && mod(ny, 2.0) > 0.001) discard;
    if (intensity <= 0.4 && mod(nx, 3.0) > 0.001 && mod(ny, 3.0) > 0.001) discard;
    if (intensity <= 0.25 && mod(nx, 4.0) > 0.001 && mod(ny, 4.0) > 0.001) discard;
    if (intensity <= 0.1 && mod(nx, 5.0) > 0.001 && mod(ny, 5.0) > 0.001) discard;
    if (intensity <= 0.0) discard;
    FragColor = vec4(0.0, max(0.333, intensity), 0.0, 1.0);
}
`;
            const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragShader, fragCode);
            gl.compileShader(fragShader);
            infoLog = gl.getShaderInfoLog(vertShader);
            if (infoLog.length > 0)
                throw new Error(`FRAGMENT SHADER ERROR :: ${infoLog}`);

            this.program = gl.createProgram();
            gl.attachShader(this.program, vertShader);
            gl.attachShader(this.program, fragShader);
            gl.linkProgram(this.program);
            infoLog = gl.getProgramInfoLog(this.program);
            if (infoLog.length > 0)
                throw new Error(`SHADER PROGRAM LINKAGE ERROR :: ${infoLog}`);

            this.initialized = true;
        }

        gl.disable(gl.DEPTH_TEST);
        gl.depthMask(false);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.useProgram(this.program);

        let uniformLoc = gl.getUniformLocation(this.program, "u_cameraViewProj");
        gl.uniformMatrix4fv(uniformLoc, false, globalConfig.uniformConfigById["u_cameraViewProj"].getCurrentValue(ecs));
        uniformLoc = gl.getUniformLocation(this.program, "u_cameraPosition");
        gl.uniform3fv(uniformLoc, globalConfig.uniformConfigById["u_cameraPosition"].getCurrentValue(ecs));

        const positionLoc = gl.getAttribLocation(this.program, "position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
        this.floatsPending = 0;

        const colliderEntities = this.queryEntityGroup("Collider");

        let colliderCount = 0;
        colliderEntities.forEach((entity: Entity) => {
            const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
            const collider = ecs.getComponent(entity.id, "Collider") as ColliderComponent;

            const p = tr.position;
            vec3.scale(this.boundingBoxHalfSize, collider.boundingBoxSize, 0.5);
            const halfSize = this.boundingBoxHalfSize;

            let i = (colliderCount++) * this.floatsPerVertex * this.verticesPerCube;

            // Lines that are parallel to the z-axis.
            for (let xSign = -1; xSign <= 1; xSign += 2)
            {
                for (let ySign = -1; ySign <= 1; ySign += 2)
                {
                    for (let zSign = -1; zSign <= 1; zSign += 2)
                    {
                        this.verticesData[i++] = p[0] + halfSize[0] * xSign;
                        this.verticesData[i++] = p[1] + halfSize[1] * ySign;
                        this.verticesData[i++] = p[2] + halfSize[2] * zSign;
                    }
                }
            }
            // Lines that are parallel to the y-axis.
            for (let xSign = -1; xSign <= 1; xSign += 2)
            {
                for (let zSign = -1; zSign <= 1; zSign += 2)
                {
                    for (let ySign = -1; ySign <= 1; ySign += 2)
                    {
                        this.verticesData[i++] = p[0] + halfSize[0] * xSign;
                        this.verticesData[i++] = p[1] + halfSize[1] * ySign;
                        this.verticesData[i++] = p[2] + halfSize[2] * zSign;
                    }
                }
            }
            // Lines that are parallel to the x-axis.
            for (let ySign = -1; ySign <= 1; ySign += 2)
            {
                for (let zSign = -1; zSign <= 1; zSign += 2)
                {
                    for (let xSign = -1; xSign <= 1; xSign += 2)
                    {
                        this.verticesData[i++] = p[0] + halfSize[0] * xSign;
                        this.verticesData[i++] = p[1] + halfSize[1] * ySign;
                        this.verticesData[i++] = p[2] + halfSize[2] * zSign;
                    }
                }
            }
            this.floatsPending += this.floatsPerVertex * this.verticesPerCube;
            if (this.floatsPending == this.verticesData.length)
                this.drawPendingVertices(gl);
        });

        if (this.floatsPending > 0)
            this.drawPendingVertices(gl);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.disableVertexAttribArray(positionLoc);
        gl.useProgram(null);
    }

    onEntityRegistered(ecs: ECSManager, entity: Entity, componentAdded: Component)
    {
    }

    onEntityUnregistered(ecs: ECSManager, entity: Entity, componentRemoved: Component)
    {
    }

    private drawPendingVertices(gl: WebGL2RenderingContext)
    {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticesData);
        gl.drawArrays(gl.LINES, 0, this.floatsPending / this.floatsPerVertex);
        this.floatsPending = 0;
    }
}