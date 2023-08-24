export default abstract class AsyncLoadableObject
{
    protected static cache: {[id: string]: any} = {};
    protected static loadStartedIds: Set<string> = new Set<string>();

    protected constructor() {}

    static get(id: string, options: any): any
    {
        if (this.cache[id] != undefined) // Object has already been loaded.
        {
            return this.cache[id];
        }
        else if (!this.loadStartedIds.has(id)) // Must start loading the object.
        {
            this.load(id, options);
            return undefined;
        }
        else // Currently being loaded.
        {
            return undefined;
        }
    }

    protected static async load(id: string, options: any)
    {
        this.loadStartedIds.add(id);
        this.cache[id] = await this.loadRoutine(id, options);
    }

    protected static async loadRoutine(id: string, options: any): Promise<any>
    {
        throw new Error(`Override of the "loadRoutine" method is missing.`);
    }
}