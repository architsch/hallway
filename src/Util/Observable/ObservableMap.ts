import IObservable from "./IObservable";

export default class ObservableMap<T1, T2> implements IObservable
{
    private map: Map<T1, T2>;

    private callbacks_set: {[key: string]: (k: T1, v: T2) => void};
    private callbacks_delete: {[key: string]: (k: T1) => void};
    private callbacks_clear: {[key: string]: () => void};

    constructor()
    {
        this.map = new Map<T1, T2>();
        this.callbacks_set = {};
        this.callbacks_delete = {};
        this.callbacks_clear = {};
    }

    subscribe_set(key: string, callback: (k: T1, v: T2) => void)
    {
        if (this.callbacks_set[key] != undefined)
            throw new Error(`Key "${key}" already exists.`);
        this.callbacks_set[key] = callback;
    }

    subscribe_delete(key: string, callback: (k: T1) => void)
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

    set(k: T1, v: T2)
    {
        this.map.set(k, v);
        for (const callback of Object.values(this.callbacks_set))
            callback(k, v);
    }

    delete(k: T1)
    {
        this.map.delete(k);
        for (const callback of Object.values(this.callbacks_delete))
            callback(k);
    }

    clear()
    {
        this.map.clear();
        for (const callback of Object.values(this.callbacks_clear))
            callback();
    }

    get(k: T1): T2
    {
        return this.map.get(k);
    }

    has(k: T1): boolean
    {
        return this.map.has(k);
    }
}