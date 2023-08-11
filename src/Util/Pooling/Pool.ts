import PoolableObject from "./PoolableObject";

export default class Pool<T extends PoolableObject>
{
    private maxInstances: number;
    private instantiationMethod: () => T;

    private instances: Array<T>;
    private freeIds: Array<number>;

    constructor(maxInstances: number, instantiationMethod: () => T)
    {
        this.maxInstances = maxInstances;
        this.instantiationMethod = instantiationMethod;

        this.instances = new Array<T>(maxInstances);
        this.freeIds = new Array<number>(maxInstances);

        for (let i = 0; i < maxInstances; ++i)
        {
            const instance = instantiationMethod();
            instance.id = i;
            this.instances[i] = instance;
            this.freeIds[i] = i;
        }
    }

    get(id: number): T
    {
        return this.instances[id];
    }

    rent(): T
    {
        if (this.freeIds.length == 0)
        {
            console.error("Pool size exceeded.");
            const newId = this.maxInstances++;
            this.freeIds.push(newId);

            const instance = this.instantiationMethod();
            instance.id = newId;
            this.instances.push(instance);
        }
        const id = this.freeIds.pop();
        return this.instances[id];
    }

    return(id: number)
    {
        this.freeIds.push(id);
    }
}