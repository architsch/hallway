import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const worldBoundColliderThickness = 5;
const s = g.spriteAtlasGridCellSize;

export default class EntityConfigFactory
{
    static periodicSpawner(entityConfig: EntityConfig,
        size: number, spriteCoords: [number, number],
        gravityMultiplier: number,
        spawnInterval: number, spawnOffset: [number, number, number],
        entityToSpawnConfigId: string): EntityConfig
    {
        this.tangibleObject(entityConfig, size, spriteCoords, [0,0,0], gravityMultiplier, "Rigidbody");
        this.add(entityConfig, "SpawnOnInterval", {
            interval: ["number", spawnInterval],
            entityToSpawnConfigId: ["string", entityToSpawnConfigId],
            spawnOffset: ["vec3", vec3.fromValues(spawnOffset[0], spawnOffset[1], spawnOffset[2])],
        });
        return entityConfig;
    }

    static bullet(entityConfig: EntityConfig,
        size: number, spriteCoords: [number, number],
        initialVelocity: [number, number, number], gravityMultiplier: number,
        explosionEntityConfigId: string): EntityConfig
    {
        this.tangibleObject(entityConfig, size, spriteCoords, initialVelocity, gravityMultiplier, "Rigidbody");
        this.add(entityConfig, "SpawnOnCollision", {
            myEntityComponentTypeRequired: ["string", undefined],
            otherEntityComponentTypeRequired: ["string", "Rigidbody"],
            entityToSpawnConfigId: ["string", explosionEntityConfigId],
        });
        this.add(entityConfig, "DieOnCollision", {
            myEntityComponentTypeRequired: ["string", undefined],
            otherEntityComponentTypeRequired: ["string", "Rigidbody"],
        });
        return entityConfig;
    }

    static explosion(entityConfig: EntityConfig,
        size: number, spriteStartCoords: [number, number], numFrames: number,
        explosionForceEntityConfigId: string): EntityConfig
    {
        this.animatedVFXParticle(entityConfig, size, spriteStartCoords, numFrames);
        this.add(entityConfig, "SpawnAfterDelay", {
            delay: ["number", 0],
            entityToSpawnConfigId: ["string", explosionForceEntityConfigId],
        });
        this.add(entityConfig, "DieAfterDelay", {
            delay: ["number", numFrames / g.animFramesPerSecond],
        });
        return entityConfig;
    }

    static explosionForce(entityConfig: EntityConfig,
        forceIntensity: number, forceRadius: number): EntityConfig
    {
        this.add(entityConfig, "Transform", {});
        this.add(entityConfig, "TransformChild", {});
        this.add(entityConfig, "Collider", {
            boundingBoxSize: ["vec3", vec3.fromValues(2*forceRadius, 2*forceRadius, 2*forceRadius)],
        });
        this.add(entityConfig, "RadialForceField", {
            forceIntensity: ["number", forceIntensity],
            forceFalloffStartRadius: ["number", forceRadius * 0.75],
            forceFalloffEndRadius: ["number", forceRadius],
        });
        this.add(entityConfig, "DieAfterDelay", {
            delay: ["number", 0],
        });
        return entityConfig;
    }

    static tangibleObject(entityConfig: EntityConfig,
        size: number, spriteCoords: [number, number],
        initialVelocity: [number, number, number], gravityMultiplier: number,
        bodyType: "Rigidbody" | "Softbody"): EntityConfig
    {
        this.add(entityConfig, "Transform", {
            scale: ["vec3", vec3.fromValues(size, size, size)],
        });
        this.add(entityConfig, "MeshInstance", {
            meshConfigId: ["string", "particle"],
        });
        this.add(entityConfig, "Sprite", {
            uvScale: ["vec2", vec2.fromValues(1*s, 1*s)],
            uvShift: ["vec2", vec2.fromValues(spriteCoords[0]*s, spriteCoords[1]*s)],
        });
        this.add(entityConfig, "Kinematics", {
            decelerationRate: ["number", 1],
            gravityMultiplier: ["number", gravityMultiplier],
            velocity: ["vec3", vec3.fromValues(initialVelocity[0], initialVelocity[1], initialVelocity[2])],
        });
        this.add(entityConfig, bodyType, {});
        this.add(entityConfig, "Collider", {
            boundingBoxSize: ["vec3", vec3.fromValues(size, size, size)],
        });
        return entityConfig;
    }

    static animatedVFXParticle(entityConfig: EntityConfig,
        size: number, spriteStartCoords: [number, number], numFrames: number): EntityConfig
    {
        this.add(entityConfig, "Transform", {
            scale: ["vec3", vec3.fromValues(size, size, size)],
        });
        this.add(entityConfig, "MeshInstance", {
            meshConfigId: ["string", "particle"],
        });
        this.add(entityConfig, "AnimatedSprite", {
            uvScale: ["vec2", vec2.fromValues(1*s, 1*s)],
            uvShiftStart: ["vec2", vec2.fromValues(spriteStartCoords[0]*s, spriteStartCoords[1]*s)],
            uvShiftMod: ["vec2", vec2.fromValues(numFrames, 1)],
        });
        return entityConfig;
    }

    private static add(entityConfig: EntityConfig, componentName: string, componentBody: any)
    {
        if (entityConfig[componentName] != undefined)
            throw new Error(`Component already defined :: ${componentName}`);
        entityConfig[componentName] = componentBody;
    }
}