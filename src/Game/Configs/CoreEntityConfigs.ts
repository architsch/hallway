import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import EntityConfigFactory from "../Factories/EntityConfigFactory";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const s = g.spriteAtlasGridCellSize;

export const coreEntityConfigById: {[id: string]: EntityConfig} = {
    "empty": {
    },
    "player": {
        "PlayerComponent": {},
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(
                0.5 * (g.worldBoundMin[0] + g.worldBoundMax[0]),
                g.worldBoundMin[1] + 0.5*g.playerBoundingBoxSize[1],
                g.worldBoundMin[2] + g.worldChunkSize[2] * (g.numWorldChunks-1) + 0.5*g.playerBoundingBoxSize[2])],
            rotation: ["vec3", vec3.fromValues(0, 180, 0)],
        },
        "KinematicsComponent": {
            decelerationRate: ["number", 5],
        },
        "RigidbodyComponent": {
        },
        "ColliderComponent": {
            boundingBoxSize: ["vec3", vec3.fromValues(g.playerBoundingBoxSize[0], g.playerBoundingBoxSize[1], g.playerBoundingBoxSize[2])],
        },
        "CameraComponent": {
            fovy: ["number", 45 * deg2rad],
            aspectRatio: ["number", 2],
            near: ["number", 0.1],
            far: ["number", 100],
        },
    },
    "playerWind": EntityConfigFactory.explosionForce({}, 100, 4),

    "cube": {
        "TransformComponent": {},
        "MeshInstanceComponent": {meshConfigId: ["string", "cube"]},
        "SpriteComponent": {
            uvShift: ["vec2", vec2.fromValues(15*s, 8*s)],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            boundingBoxSize: ["vec3", vec3.fromValues(1, 1, 1)],
        },
    },
    "column": {
        "TransformComponent": {},
        "MeshInstanceComponent": {meshConfigId: ["string", "column"]},
        "SpriteComponent": {
            uvShift: ["vec2", vec2.fromValues(15*s, 8*s)],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            boundingBoxSize: ["vec3", vec3.fromValues(1.0, g.worldChunkSize[1], 1.0)],
        },
    },
    "floor": {
        "TransformComponent": {},
        "MeshInstanceComponent": {meshConfigId: ["string", "floor"]},
        "SpriteComponent": {},
    },
    "wall": {
        "TransformComponent": {},
        "MeshInstanceComponent": {meshConfigId: ["string", "wall"]},
        "SpriteComponent": {},
    },
    
    "mainLight": {
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(-100, 200, 50)],
            rotation: ["vec3", vec3.fromValues(45 * deg2rad, 45 * deg2rad, 0)],
        },
        "LightComponent": {
            ambLightColor: ["vec3", vec3.fromValues(1, 1, 1)],
            ambLightIntensity: ["number", 0.3],
            spotLightColor: ["vec3", vec3.fromValues(1, 1, 1)],
            spotLightIntensity: ["number", 0.7],
            falloffStartAngle: ["number", 45 * Math.PI / 180],
            falloffEndAngle: ["number", 55 * Math.PI / 180],
            linearAttenFactor: ["number", 0],
            squareAttenFactor: ["number", 0],
        },
        "DontDisplaceOnLevelChangeComponent": {},
    },
    "levelPortal": {
        "TransformComponent": {},
        "MeshInstanceComponent": {meshConfigId: ["string", "particle"]},
        "SpriteComponent": {
            uvShift: ["vec2", vec2.fromValues(0, 0)],
        },
        "LevelPortalComponent": {},
        "ColliderComponent": {
            boundingBoxSize: ["vec3", vec3.fromValues(1, 1, 1)],
        },
    },
    "worldBoundFloorCollider": {
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] - 0.5*g.worldBoundColliderThickness,
                g.worldBoundMin[2] + 0.5*g.worldBoundSize[2]
            )],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + g.worldBoundColliderThickness, g.worldBoundColliderThickness, g.worldBoundSize[2] + g.worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChangeComponent": {},
    },
    "worldBoundCeilingCollider": {
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] + g.worldBoundSize[1] + 0.5*g.worldBoundColliderThickness,
                g.worldBoundMin[2] + 0.5*g.worldBoundSize[2]
            )],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + g.worldBoundColliderThickness, g.worldBoundColliderThickness, g.worldBoundSize[2] + g.worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChangeComponent": {},
    },
    "worldBoundLeftWallCollider": {
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] - 0.5*g.worldBoundColliderThickness,
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] + 0.5*g.worldBoundSize[2]
            )],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundColliderThickness, g.worldBoundSize[1] + g.worldBoundColliderThickness, g.worldBoundSize[2] + g.worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChangeComponent": {},
    },
    "worldBoundRightWallCollider": {
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + g.worldBoundSize[0] + 0.5*g.worldBoundColliderThickness,
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] + 0.5*g.worldBoundSize[2]
            )],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundColliderThickness, g.worldBoundSize[1] + g.worldBoundColliderThickness, g.worldBoundSize[2] + g.worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChangeComponent": {},
    },
    "worldBoundBackWallCollider": {
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] - 0.5*g.worldBoundColliderThickness
            )],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + g.worldBoundColliderThickness, g.worldBoundSize[1] + g.worldBoundColliderThickness, g.worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChangeComponent": {},
    },
    "worldBoundFrontWallCollider": {
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] + g.worldBoundSize[2] + 0.5*g.worldBoundColliderThickness
            )],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + g.worldBoundColliderThickness, g.worldBoundSize[1] + g.worldBoundColliderThickness, g.worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChangeComponent": {},
    },
    "backWallCollider": {
        "TransformComponent": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] - 0.5*g.worldBoundColliderThickness + g.worldChunkSize[2] * (g.numWorldChunks-1)
            )],
        },
        "RigidbodyComponent": {},
        "ColliderComponent": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + g.worldBoundColliderThickness, g.worldBoundSize[1] + g.worldBoundColliderThickness, g.worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChangeComponent": {},
        "BackWallComponent": {},
    },
};