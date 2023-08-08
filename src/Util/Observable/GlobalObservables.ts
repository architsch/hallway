import IObservable from "./IObservable";

class _GlobalObservables
{
    private observables: {[key: string]: IObservable};

    constructor()
    {
        this.observables = {};
    }

    get(key: string): IObservable
    {
        if (this.observables[key] == undefined)
            throw new Error(`Key "${key}" doesn't exist.`);
        return this.observables[key];
    }

    add(key: string, observable: IObservable)
    {
        if (this.observables[key] != undefined)
            throw new Error(`Key "${key}" already exists.`);
        this.observables[key] = observable;
    }
}
const GlobalObservables = new _GlobalObservables();
export default GlobalObservables;