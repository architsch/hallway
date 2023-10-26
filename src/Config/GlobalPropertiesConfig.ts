import { vec3 } from "gl-matrix";

const worldBoundSize = vec3.fromValues(20, 5, 20);
const worldBoundMin = vec3.create();
const worldBoundMax = vec3.create();
const worldBoundSizeInVoxels = vec3.fromValues(10, 1, 10);

vec3.set(worldBoundMin, -0.5*worldBoundSize[0], -0.5*worldBoundSize[1], -0.5*worldBoundSize[2]);
vec3.set(worldBoundMax, 0.5*worldBoundSize[0], 0.5*worldBoundSize[1], 0.5*worldBoundSize[2]);

export const globalPropertiesConfig: {
    debugEnabled: boolean,
    maxNumEntities: number,
    maxNumEstimatedCollisionPairsPerEntity: number,
    spriteAtlasGridCellSize: number,
    animFramesPerSecond: number,
    worldBoundMin: vec3,
    worldBoundMax: vec3,
    worldBoundSize: vec3,
    worldBoundSizeInVoxels: vec3,
} = {
    debugEnabled: true,
    maxNumEntities: 256,
    maxNumEstimatedCollisionPairsPerEntity: 4,
    spriteAtlasGridCellSize: 0.0625,
    animFramesPerSecond: 30,
    worldBoundMin,
    worldBoundMax,
    worldBoundSize,
    worldBoundSizeInVoxels,
};