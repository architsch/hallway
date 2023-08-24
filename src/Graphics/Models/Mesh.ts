import { globalConfig } from "../../Config/GlobalConfig";
import Geometry from "./Geometry";
import Material from "./Material";
import AsyncLoadableObject from "../../Util/Async/AsyncLoadableObject";

export default class Mesh extends AsyncLoadableObject
{
    private geometry: Geometry;
    private material: Material;

    protected static override async loadRoutine(id: string, options: {gl: WebGL2RenderingContext}): Promise<any>
    {
        const meshConfig = globalConfig.meshConfigById[id];
        if (meshConfig == undefined)
            throw new Error(`MeshConfig not found (meshConfigId = ${id})`);
        
        const gl = options.gl;

        const obj = new Mesh();
        do
        {
            obj.material = Material.get(meshConfig.materialConfigId, {gl, geometryConfigId: meshConfig.geometryConfigId});
            await new Promise(resolve => setTimeout(resolve, 100));
        } while (obj.material == undefined);
        do
        {
            obj.geometry = Geometry.get(meshConfig.geometryConfigId, {gl, program: obj.material.getProgram()});
            await new Promise(resolve => setTimeout(resolve, 100));
        } while (obj.geometry == undefined);

        return obj;
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

    updateInstanceData(instanceIndex: number, data: Float32Array)
    {
        this.geometry.updateInstanceData(instanceIndex, data);
    }

    getNumVertices(): number
    {
        return this.geometry.getNumVertices();
    }

    getNumInstances(): number
    {
        return this.geometry.getNumInstances();
    }
}