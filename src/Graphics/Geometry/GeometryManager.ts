import GLGeometry from "./GLGeometry";

export default class GeometryManager
{
    private gl: WebGL2RenderingContext;
    private geometryById: {[id: string]: GLGeometry};

    constructor(gl: WebGL2RenderingContext)
    {
        this.gl = gl;
        this.geometryById = {};

        const geometry = new GLGeometry(gl, 6, 256, [3, 2], [2, 2, 3, 3]);

        const vertexBufferData = new Float32Array([
            -0.5, -0.5, 0.0, 0.0, 0.0,
            -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.0, 1.0, 1.0,
            0.5, -0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, 0.0, 0.0, 1.0,
        ]);
        const instanceBufferData = new Float32Array(10 * 256);
        let n = 0;
        for (let i = 0; i < 256; ++i)
        {
            // uvScale
            instanceBufferData[n++] = 0.0625;
            instanceBufferData[n++] = 0.0625;
            // uvShift
            instanceBufferData[n++] = 0;
            instanceBufferData[n++] = 0;
            // position
            instanceBufferData[n++] = 0;
            instanceBufferData[n++] = 0;
            instanceBufferData[n++] = 0;
            // scale
            instanceBufferData[n++] = 1;
            instanceBufferData[n++] = 1;
            instanceBufferData[n++] = 0;
        }

        geometry.setVertexData(vertexBufferData);
        geometry.setInstanceData(instanceBufferData);

        this.geometryById["default"] = geometry;
    }

    getGeometry(id: string): GLGeometry
    {
        return this.geometryById[id];
    }
}