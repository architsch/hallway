import { globalConfig } from "../../Config/GlobalConfig";
import AsyncLoadableObject from "../../Util/Async/AsyncLoadableObject";
import GLBuffer from "./GLBuffer";

export default class Geometry extends AsyncLoadableObject
{
    private numVertices: number;
    private vertexBuffer: GLBuffer;
    private numInstances: number;
    private instanceBuffer: GLBuffer;

    protected static override async loadRoutine(id: string,
        options: {gl: WebGL2RenderingContext, program: WebGLProgram}): Promise<Geometry>
    {
        console.log(`Started loading Geometry (id = ${id})...`);
        
        const geometryConfig = globalConfig.geometryConfigById[id];
        if (geometryConfig == undefined)
            throw new Error(`GeometryConfig not found (geometryConfigId = ${id})`);

        const gl = options.gl;
        const program = options.program;

        const obj = new Geometry();

        obj.numVertices = geometryConfig.numVertices;
        obj.numInstances = geometryConfig.numInstances;
        
        obj.vertexBuffer = new GLBuffer(gl, program, gl.ARRAY_BUFFER, gl.STATIC_DRAW,
            geometryConfig.numVertices, geometryConfig.vertexAttribs, false);
        obj.instanceBuffer = new GLBuffer(gl, program, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW,
            geometryConfig.numInstances, geometryConfig.instanceAttribs, true);
        console.log(`Geometry loaded :: ${id}`);
        return obj;
    }

    use()
    {
        this.vertexBuffer.use();
        this.instanceBuffer.use();
    }

    unuse()
    {
        this.vertexBuffer.unuse();
        this.instanceBuffer.unuse();
    }

    updateInstanceData(instanceIndex: number, data: Float32Array)
    {
        this.instanceBuffer.setDataAtStrideIndex(instanceIndex, data);
    }

    getNumVertices(): number
    {
        return this.numVertices;
    }

    getNumInstances(): number
    {
        return this.numInstances;
    }
}