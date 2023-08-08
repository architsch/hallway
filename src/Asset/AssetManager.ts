import GeometryManager from "./GeometryManager";
import MaterialManager from "./MaterialManager";
import MeshManager from "./MeshManager";
import TextureManager from "./TextureManager";

export default class AssetManager
{
    private textureManager: TextureManager;
    private materialManager: MaterialManager;
    private geometryManager: GeometryManager;
    private meshManager: MeshManager;

    constructor()
    {
        this.textureManager = new TextureManager();
        this.materialManager = new MaterialManager(this.textureManager);
        this.geometryManager = new GeometryManager();
        this.meshManager = new MeshManager(this.materialManager, this.geometryManager);
    }

    getMesh(id: string): THREE.Mesh
    {
        return this.meshManager.getMesh(id);
    }
}