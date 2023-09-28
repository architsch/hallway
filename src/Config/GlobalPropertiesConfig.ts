import { vec3 } from "gl-matrix";

const worldChunkSize = vec3.fromValues(11, 7, 13);
const numWorldChunks = 5;
const worldBoundMin = vec3.create();
const worldBoundMax = vec3.create();
const worldBoundSize = vec3.create();

vec3.set(worldBoundMin, -0.5*worldChunkSize[0], 0, 0);
vec3.set(worldBoundMax, 0.5*worldChunkSize[0], worldChunkSize[1], worldChunkSize[2] * numWorldChunks);
vec3.subtract(worldBoundSize, worldBoundMax, worldBoundMin);

export const globalPropertiesConfig: {
    debugEnabled: boolean,
    maxNumEntities: number,
    estimatedMaxCollisionsPerEntity: number,
    spriteAtlasGridCellSize: number,
    animFramesPerSecond: number,
    worldChunkSize: vec3,
    numWorldChunks: number,
    worldBoundMin: vec3,
    worldBoundMax: vec3,
    worldBoundSize: vec3,
} = {
    debugEnabled: true,
    maxNumEntities: 2048,
    estimatedMaxCollisionsPerEntity: 16,
    spriteAtlasGridCellSize: 0.0625,
    animFramesPerSecond: 30,
    worldChunkSize,
    numWorldChunks,
    worldBoundMin,
    worldBoundMax,
    worldBoundSize,
};