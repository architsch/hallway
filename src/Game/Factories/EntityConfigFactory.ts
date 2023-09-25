import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const worldBoundColliderThickness = 5;
const s = g.spriteAtlasGridCellSize;

export default class EntityConfigFactory
{
    static projectile(size: number, spriteCoords: [number, number], initialVelocity: [number, number, number],
        gravityMultiplier: number, explosionEntityConfigId: string): EntityConfig
    {
        return {
            "Transform": {
                scale: ["vec3", vec3.fromValues(size, size, size)],
            },
            "MeshInstance": {meshConfigId: ["string", "particle"]},
            "Sprite": {
                uvScale: ["vec2", vec2.fromValues(1*s, 1*s)],
                uvShift: ["vec2", vec2.fromValues(spriteCoords[0]*s, spriteCoords[1]*s)],
            },
            "Kinematics": {
                decelerationRate: ["number", 0],
                gravityMultiplier: ["number", gravityMultiplier],
                velocity: ["vec3", vec3.fromValues(initialVelocity[0], initialVelocity[1], initialVelocity[2])],
            },
            "Rigidbody": {},
            "Collider": {
                boundingBoxSize: ["vec3", vec3.fromValues(size, size, size)],
            },
            "SelfRemover": {},
            "Spawner": {
                entityToSpawnConfigId: ["string", explosionEntityConfigId],
            },
            "SelfRemoveOnCollisionWithRigidbody": {},
            "SpawnOnCollisionWithRigidbody": {},
        };
    }
}