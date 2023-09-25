import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import EntityConfigFactory from "../../Game/Factories/EntityConfigFactory";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const worldBoundColliderThickness = 5;
const s = g.spriteAtlasGridCellSize;

export const dynamicEntityConfigById: {[id: string]: EntityConfig} = {
    "actor": {
        "Transform": {
            scale: ["vec3", vec3.fromValues(2, 2, 2)],
        },
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {
            uvScale: ["vec2", vec2.fromValues(2*s, 2*s)],
            uvShift: ["vec2", vec2.fromValues(0, 6*s)],
        },
        "Kinematics": {},
        "Rigidbody": {},
        "Collider": {
            boundingBoxSize: ["vec3", vec3.fromValues(1.75, 2, 0.5)],
        },
    },
    "shooter": {
        "Transform": {
            scale: ["vec3", vec3.fromValues(1, 1, 1)],
        },
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {
            uvScale: ["vec2", vec2.fromValues(1*s, 1*s)],
            uvShift: ["vec2", vec2.fromValues(1*s, 3*s)],
        },
        "Kinematics": {},
        "Rigidbody": {},
        "Collider": {
            boundingBoxSize: ["vec3", vec3.fromValues(1, 3, 1)],
        },
        "Timer": {
            initialDelay: ["number", 1],
            tickInterval: ["number", 1],
            maxTicks: ["number", -1],
        },
        "Spawner": {
            entityToSpawnConfigId: ["string", "projectile"],
            spawnOffset: ["vec3", vec3.fromValues(0, 0, -1)],
        },
        "SpawnOnTimerTick": {},
    },
    "projectile": EntityConfigFactory.projectile(0.5, [8, 3], [0, 0, -5], 0.05, "vfx"),
};