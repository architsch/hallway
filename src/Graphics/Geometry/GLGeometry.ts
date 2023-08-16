import GLInstanceBuffer from "./GLInstanceBuffer";
import GLVertexBuffer from "./GLVertexBuffer";

export default class GLGeometry
{
    private numVertices: number;
    private numInstances: number;
    private vertexBuffer: GLVertexBuffer;
    private instanceBuffer: GLInstanceBuffer;

    constructor(gl: WebGL2RenderingContext, numVertices: number, numInstances: number,
        vertexAttribSizes: Array<number>, instanceAttribSizes: Array<number>)
    {
        this.numVertices = numVertices;
        this.numInstances = numInstances;
        this.vertexBuffer = new GLVertexBuffer(gl, numVertices, vertexAttribSizes);
        this.instanceBuffer = new GLInstanceBuffer(gl, numInstances, instanceAttribSizes);
    }

    getNumVertices(): number
    {
        return this.numVertices;
    }

    getNumInstances(): number
    {
        return this.numInstances;
    }

    setVertexData(data: Float32Array)
    {
        this.vertexBuffer.setData(data);
    }

    clearInstanceData(clearValue: number)
    {
        this.instanceBuffer.clearData(clearValue);
    }

    setInstanceData(data: Float32Array)
    {
        this.instanceBuffer.setData(data);
    }

    setInstanceDataAt(instanceIndex: number, data: Float32Array)
    {
        this.instanceBuffer.setDataAt(instanceIndex, data);
    }

    use()
    {
        this.vertexBuffer.use();
        this.instanceBuffer.use();
    }
}