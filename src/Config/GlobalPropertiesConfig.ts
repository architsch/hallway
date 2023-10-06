import { vec3 } from "gl-matrix";

const worldBoundSize = vec3.fromValues(11, 5, 50);
const worldBoundMin = vec3.create();
const worldBoundMax = vec3.create();
const worldBoundColliderThickness = 5;
const playerBoundingBoxSize = vec3.fromValues(0.7, 2, 0.7);

vec3.set(worldBoundMin, -0.5*worldBoundSize[0], 0, 0);
vec3.set(worldBoundMax, 0.5*worldBoundSize[0], worldBoundSize[1], worldBoundSize[2]);

export const globalPropertiesConfig: {
    debugEnabled: boolean,
    maxNumEntities: number,
    estimatedMaxCollisionsPerEntity: number,
    spriteAtlasGridCellSize: number,
    animFramesPerSecond: number,
    worldBoundMin: vec3,
    worldBoundMax: vec3,
    worldBoundSize: vec3,
    worldBoundColliderThickness: number,
    playerBoundingBoxSize: vec3,
} = {
    debugEnabled: false,
    maxNumEntities: 2048,
    estimatedMaxCollisionsPerEntity: 16,
    spriteAtlasGridCellSize: 0.0625,
    animFramesPerSecond: 30,
    worldBoundMin,
    worldBoundMax,
    worldBoundSize,
    worldBoundColliderThickness,
    playerBoundingBoxSize,
};