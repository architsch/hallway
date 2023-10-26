import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import EntityConfigFactory from "../../Game/Factories/EntityConfigFactory";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const s = g.spriteAtlasGridCellSize;

export const dynamicEntityConfigById: {[id: string]: EntityConfig} = {
    "actor": {
        "TransformComponent": {
            scale: ["vec3", vec3.fromValues(2, 2, 2)],
        },
        "MeshInstanceComponent": {meshConfigId: ["string", "particle"]},
        "SpriteComponent": {
            uvScale: ["vec2", vec2.fromValues(2*s, 2*s)],
            uvShift: ["vec2", vec2.fromValues(0, 6*s)],
        },
        "KinematicsComponent": {},
        "RigidbodyComponent": {},
        "ColliderComponent": {
            boundingBoxSize: ["vec3", vec3.fromValues(1.75, 2, 0.5)],
        },
    },
    "shooter_explodeOnHit": EntityConfigFactory.shooter({}, 1, [1, 3], 1, 1, [0, 1, -1], "projectile_explodeOnHit"),
    "projectile_explodeOnHit": EntityConfigFactory.projectile_explodeOnHit({}, 0.5, [8, 3], [0, 4, -5], 0.5, "explosion_explodeOnHit"),
    "explosion_explodeOnHit": EntityConfigFactory.explosion({}, 2, [0, 15], 16, "explosionForce_explodeOnHit"),
    "explosionForce_explodeOnHit": EntityConfigFactory.explosionForce({}, 100, 4),
};