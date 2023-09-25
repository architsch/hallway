import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import ECSManager from "../ECSManager";
import Entity from "../Entity";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const worldBoundColliderThickness = 5;
const s = g.spriteAtlasGridCellSize;

export const vfxEntityConfigById: {[id: string]: EntityConfig} = {
    "particle": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {
            uvShift: ["vec2", vec2.fromValues(1*s, 0)],
        },
    },
    "vfx": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "AnimatedSprite": {
            uvShiftStart: ["vec2", vec2.fromValues(0, 15*s)],
            uvShiftMod: ["vec2", vec2.fromValues(16, 1)],
            framesPerSecond: ["number", 30],
        },
        "Timer": {
            initialDelay: ["number", 0.5],
            tickInterval: ["number", 0],
            maxTicks: ["number", 1],
        },
        "SelfRemover": {},
        "SelfRemoveOnTimerTick": {},
    },
};