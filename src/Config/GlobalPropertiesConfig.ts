import { vec3 } from "gl-matrix";

const worldChunkSize = vec3.fromValues(11, 7, 13);
const numWorldChunks = 5;
const worldBoundMin = vec3.create();
const worldBoundMax = vec3.create();
const worldBoundSize = vec3.create();
const worldBoundNormals: [[vec3, vec3], [vec3, vec3], [vec3, vec3]] = [
    [vec3.fromValues(1, 0, 0), vec3.fromValues(-1, 0, 0)], // xLower, xUpper
    [vec3.fromValues(0, 1, 0), vec3.fromValues(0, -1, 0)], // yLower, yUpper
    [vec3.fromValues(0, 0, 1), vec3.fromValues(0, 0, -1)], // zLower, zUpper
];

vec3.set(worldBoundMin, -0.5*worldChunkSize[0], 0, 0);
vec3.set(worldBoundMax, 0.5*worldChunkSize[0], worldChunkSize[1], worldChunkSize[2] * numWorldChunks);
vec3.subtract(worldBoundSize, worldBoundMax, worldBoundMin);

export const globalPropertiesConfig: {[propertyName: string]: any} = {
    worldChunkSize,
    numWorldChunks,
    worldBoundMin,
    worldBoundMax,
    worldBoundSize,
    worldBoundNormals,
};