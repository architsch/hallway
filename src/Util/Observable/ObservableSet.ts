import IObservable from "./IObservable";

export default class ObservableSet<T> implements IObservable
{
    private set: Set<T>;

    private callbacks_add: {[key: string]: (value: T) => void};
    private callbacks_delete: {[key: string]: (value: T) => void};
    private callbacks_clear: {[key: string]: () => void};

    constructor()
    {
        this.set = new Set<T>();
        this.callbacks_add = {};
        this.callbacks_delete = {};
        this.callbacks_clear = {};
    }

    subscribe_add(key: string, callback: (value: T) => void)
    {
        if (this.callbacks_add[key] != undefined)
            throw new Error(`Key "${key}" already exists.`);
        this.callbacks_add[key] = callback;
    }

    subscribe_delete(key: string, callback: (value: T) => void)
    {
        if (this.callbacks_delete[key] != undefined)
            throw new Error(`Key "${key}" already exists.`);
        this.callbacks_delete[key] = callback;
    }

    subscribe_clear(key: string, callback: () => void)
    {
        if (this.callbacks_clear[key] != undefined)
            throw new Error(`Key "${key}" already exists.`);
        this.callbacks_clear[key] = callback;
    }

    add(value: T)
    {
        this.set.add(value);
        for (const callback of Object.values(this.callbacks_add))
            callback(value);
    }

    delete(value: T)
    {
        this.set.delete(value);
        for (const callback of Object.values(this.callbacks_delete))
            callback(value);
    }

    clear()
    {
        this.set.clear();
        for (const callback of Object.values(this.callbacks_clear))
            callback();
    }

    has(value: T): boolean
    {
        return this.set.has(value);
    }
}