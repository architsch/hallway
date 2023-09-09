export default class Random
{
    static randomBetween(min: number, max: number): number
    {
        return min + (max - min) * Math.random();
    }

    static getRandomRadian(): number
    {
        return Math.random() * 2*Math.PI;
    }
}