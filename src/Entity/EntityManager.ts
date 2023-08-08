import Entity from "./Entity";

export default class EntityManager
{
    private maxNumEntities: number = 1024;
    private entityById: Array<Entity>;

    constructor()
    {
        this.entityById = new Array<Entity>(this.maxNumEntities);
    }
}