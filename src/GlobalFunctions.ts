class _GlobalFunctions
{
    private funcs: {[funcName: string]: (funcParams: any) => any};

    constructor()
    {
        this.funcs = {};
    }

    register(funcName: string, func: (funcParams: any) => any)
    {
        if (this.funcs[funcName] != undefined)
            throw new Error(`Global function called "${funcName}" already exists.`);
        this.funcs[funcName] = func;
    }

    call(funcName: string, funcParams: any): any
    {
        return this.funcs[funcName](funcParams);
    }
}
export const GlobalFunctions = new _GlobalFunctions();