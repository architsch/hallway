export default class Random
{
    static randomBetween(min: number, max: number): number
    {
        return min + (max - min) * Math.random();
    }

    static randomIntBetween(min: number, max: number): number
    {
        return Math.floor(this.randomBetween(min, max));
    }

    static selectByWeightedChance<T>(elements: Array<T>, chanceWeights: Array<number>): T
    {
        if (elements.length != chanceWeights.length)
            throw new Error(`Array length mismatch (elements.length = ${elements.length}, chanceWeights.length = ${chanceWeights.length})`);
        let weightSum = 0;
        for (let i = 0; i < chanceWeights.length; ++i)
            weightSum += chanceWeights[i];

        let weightCumulated = 0;
        let rand = Math.random() * weightSum;

        for (let i = 0; i < elements.length; ++i)
        {
            weightCumulated += chanceWeights[i];
            if (rand <= weightCumulated)
                return elements[i];
        }
        console.error(`Failed to select by weight (weightSum = ${weightSum}, weightCumulated = ${weightCumulated})`);
        return elements[0];
    }

    static getRandomRadian(): number
    {
        return Math.random() * 2*Math.PI;
    }
}