export default class TextureManager
{
    private textureById: {[id: string]: THREE.Texture};

    constructor()
    {
        this.textureById = {};
    }

    getTexture(id: string): THREE.Texture
    {
        return this.textureById[id];
    }
}