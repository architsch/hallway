import GLCamera from "./Camera/GLCamera";
import Mesh from "./Mesh/Mesh";

export default class Renderer
{
    private gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext)
    {
        this.gl = gl;
        gl.clearColor(0.2, 0.4, 0.2, 1.0);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    render(meshById: {[id: string]: Mesh}, camera: GLCamera)
    {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

        if (!camera.isMatrixSynced())
            camera.syncMatrix();

        for (const mesh of Object.values(meshById))
        {
            mesh.updateUniform("u_cameraViewProj", camera.getViewProjMatrix());
            mesh.use();
            this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, mesh.getNumVertices(), mesh.getNumInstances());
        }
    }
}