import { globalPropertiesConfig } from "../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;
let nextBitIndex = 0;

export abstract class Component
{
    abstract applyDefaultValues(): void;
}

export class ComponentBitMask
{
    n1: number = 0;
    n2: number = 0;

    registerBit(bitIndex: number): ComponentBitMask
    {
        if (bitIndex < 32)
            this.n1 |= Math.pow(2, bitIndex);
        else if (bitIndex < 64)
            this.n2 |= Math.pow(2, bitIndex - 31);
        else
            throw new Error(`Bit index range exceeded (bitIndex = ${bitIndex})`);
        return this;
    }
    clear()
    {
        this.n1 = 0;
        this.n2 = 0;
    }
    addMask(mask: ComponentBitMask)
    {
        if (this.hasAtLeastOneComponentInMask(mask))
            throw new Error(`There is at least one component that is already added.`);
        this.n1 |= mask.n1;
        this.n2 |= mask.n2;
    }
    removeMask(mask: ComponentBitMask)
    {
        if (!this.hasAllComponentsInMask(mask))
            throw new Error(`There is at least one component that is already removed.`);
        this.n1 ^= mask.n1;
        this.n2 ^= mask.n2;
    }
    hasAllComponentsInMask(mask: ComponentBitMask): boolean
    {
        return ((this.n1 & mask.n1) == mask.n1) && ((this.n2 & mask.n2) == mask.n2);
    }
    hasAtLeastOneComponentInMask(mask: ComponentBitMask): boolean
    {
        return ((this.n1 & mask.n1) != 0) || ((this.n2 & mask.n2) != 0);
    }
}

export const ComponentCache: {[componentType: string]: Array<Component>} = {};
export const ComponentTypeBitMasks: {[componentType: string]: ComponentBitMask} = {};

export function registerComponent<T extends Component>(componentType: string, instantiationMethod: () => T)
{
    const N = g.maxNumEntities;
    const cache = new Array<T>(N);
    for (let i = 0; i < N; ++i)
        cache[i] = instantiationMethod();

    ComponentCache[componentType] = cache;
    ComponentTypeBitMasks[componentType] = new ComponentBitMask().registerBit(nextBitIndex++);
}