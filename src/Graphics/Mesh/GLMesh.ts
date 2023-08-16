import GLGeometry from "../Geometry/GLGeometry";
import GLMaterial from "../Material/GLMaterial";

export default class GLMesh
{
    private geometry: GLGeometry;
    private material: GLMaterial;

    constructor(geometry: GLGeometry, material: GLMaterial)
    {
        this.geometry = geometry;
        this.material = material;
    }

    getNumVertices(): number
    {
        return this.geometry.getNumVertices();
    }

    getNumInstances(): number
    {
        return this.geometry.getNumInstances();
    }

    use()
    {
        this.geometry.use();
        this.material.use();
    }

    updateUniform(name: string, value: any)
    {
        this.material.updateUniform(name, value);
    }

    clearInstanceData(clearValue: number)
    {
        this.geometry.clearInstanceData(clearValue);
    }

    setInstanceData(data: Float32Array)
    {
        this.geometry.setInstanceData(data);
    }

    setInstanceDataAt(instanceIndex: number, data: Float32Array)
    {
        this.geometry.setInstanceDataAt(instanceIndex, data);
    }
}