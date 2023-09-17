import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const deg2rad = Math.PI / 180;
const g = globalPropertiesConfig;
const worldBoundColliderThickness = 5;

export const entityConfigById: {[id: string]: EntityConfig} = {
    //--------------------------------------------------------------------------------
    // Gameplay
    //--------------------------------------------------------------------------------

    "particle": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {},
    },
    "actor": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {},
        "Kinematics": {},
        "Rigidbody": {},
        "Collider": {
            boundingBoxSize: ["vec3", vec3.fromValues(2, 2, 2)],
        },
    },
    "block": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "block"]},
        "Sprite": {},
        "Rigidbody": {},
        "Collider": {},
    },
    "floor": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "floor"]},
        "Sprite": {},
    },
    "wall": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "wall"]},
        "Sprite": {},
    },

    //--------------------------------------------------------------------------------
    // Core
    //--------------------------------------------------------------------------------

    "empty": {
    },
    "player": {
        "Player": {},
        "Transform": {},
        "Kinematics": {
            decelerationRate: ["number", 5],
        },
        "Softbody": {
        },
        "Collider": {
            boundingBoxSize: ["vec3", vec3.fromValues(1.5, 3, 1.5)],
        },
        "Camera": {
            fovy: ["number", 45 * deg2rad],
            aspectRatio: ["number", 2],
            near: ["number", 0.1],
            far: ["number", 100],
        },
    },
    "mainLight": {
        "Transform": {
            position: ["vec3", vec3.fromValues(-100, 200, 50)],
            rotation: ["vec3", vec3.fromValues(45 * deg2rad, 45 * deg2rad, 0)],
        },
        "Light": {
            ambLightColor: ["vec3", vec3.fromValues(1, 1, 1)],
            ambLightIntensity: ["number", 0.3],
            spotLightColor: ["vec3", vec3.fromValues(1, 1, 1)],
            spotLightIntensity: ["number", 0.7],
            falloffStartAngle: ["number", 45 * Math.PI / 180],
            falloffEndAngle: ["number", 55 * Math.PI / 180],
            linearAttenFactor: ["number", 0],
            squareAttenFactor: ["number", 0],
        },
        "DontDisplaceOnLevelChange": {},
    },
    "levelPortal": {
        "Transform": {},
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {},
        "LevelPortal": {},
        "Collider": {
            boundingBoxSize: ["vec3", vec3.fromValues(1, 1, 1)],
        },
    },
    "worldBoundFloorCollider": {
        "Transform": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] - 0.5*worldBoundColliderThickness,
                g.worldBoundMin[2] + 0.5*g.worldBoundSize[2]
            )],
        },
        "Rigidbody": {},
        "Collider": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + worldBoundColliderThickness, worldBoundColliderThickness, g.worldBoundSize[2] + worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChange": {},
    },
    "worldBoundCeilingCollider": {
        "Transform": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] + g.worldBoundSize[1] + 0.5*worldBoundColliderThickness,
                g.worldBoundMin[2] + 0.5*g.worldBoundSize[2]
            )],
        },
        "Rigidbody": {},
        "Collider": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + worldBoundColliderThickness, worldBoundColliderThickness, g.worldBoundSize[2] + worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChange": {},
    },
    "worldBoundLeftWallCollider": {
        "Transform": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] - 0.5*worldBoundColliderThickness,
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] + 0.5*g.worldBoundSize[2]
            )],
        },
        "Rigidbody": {},
        "Collider": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(worldBoundColliderThickness, g.worldBoundSize[1] + worldBoundColliderThickness, g.worldBoundSize[2] + worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChange": {},
    },
    "worldBoundRightWallCollider": {
        "Transform": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + g.worldBoundSize[0] + 0.5*worldBoundColliderThickness,
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] + 0.5*g.worldBoundSize[2]
            )],
        },
        "Rigidbody": {},
        "Collider": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(worldBoundColliderThickness, g.worldBoundSize[1] + worldBoundColliderThickness, g.worldBoundSize[2] + worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChange": {},
    },
    "worldBoundBackWallCollider": {
        "Transform": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] - 0.5*worldBoundColliderThickness
            )],
        },
        "Rigidbody": {},
        "Collider": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + worldBoundColliderThickness, g.worldBoundSize[1] + worldBoundColliderThickness, worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChange": {},
    },
    "worldBoundFrontWallCollider": {
        "Transform": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] + g.worldBoundSize[2] + 0.5*worldBoundColliderThickness
            )],
        },
        "Rigidbody": {},
        "Collider": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + worldBoundColliderThickness, g.worldBoundSize[1] + worldBoundColliderThickness, worldBoundColliderThickness)],
        },
        "DontDisplaceOnLevelChange": {},
    },
    "firstLevelBackWallCollider": {
        "Transform": {
            position: ["vec3", vec3.fromValues(
                g.worldBoundMin[0] + 0.5*g.worldBoundSize[0],
                g.worldBoundMin[1] + 0.5*g.worldBoundSize[1],
                g.worldBoundMin[2] - 0.5*worldBoundColliderThickness + g.worldChunkSize[2] * (g.numWorldChunks-1)
            )],
        },
        "Rigidbody": {},
        "Collider": {
            activelyDetectCollisions: ["boolean", false],
            boundingBoxSize: ["vec3", vec3.fromValues(g.worldBoundSize[0] + worldBoundColliderThickness, g.worldBoundSize[1] + worldBoundColliderThickness, worldBoundColliderThickness)],
        },
        "LevelMember": {
            levelIndex: ["number", 0],
            carryoverPending: ["boolean", false],
        },
    },
};