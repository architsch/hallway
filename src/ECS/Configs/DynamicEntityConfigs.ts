import { vec2, vec3 } from "gl-matrix";
import { EntityConfig } from "../../Config/ConfigTypes";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import ECSManager from "../ECSManager";
import Entity from "../Entity";
import { KinematicsComponent, TransformComponent } from "../../Physics/Models/PhysicsComponents";

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
            tickInterval: ["number", 1.5],
            maxTicks: ["number", -1],
            onTick: ["any", (ecs: ECSManager, entity: Entity, tickCount: number) => {
                const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
                const projectile = ecs.addEntity("projectile");
                const projectileTr = ecs.getComponent(projectile.id, "Transform") as TransformComponent;
                vec3.set(projectileTr.position, tr.position[0], tr.position[1], tr.position[2] - 1);
                const projectileK = ecs.getComponent(entity.id, "Kinematics") as KinematicsComponent;
                vec3.set(projectileK.velocity, 0, 0, -5);
            }],
        },
    },
    "projectile": {
        "Transform": {
            scale: ["vec3", vec3.fromValues(0.5, 0.5, 0.5)],
        },
        "MeshInstance": {meshConfigId: ["string", "particle"]},
        "Sprite": {
            uvScale: ["vec2", vec2.fromValues(1*s, 1*s)],
            uvShift: ["vec2", vec2.fromValues(8*s, 3*s)],
        },
        "Kinematics": {
            decelerationRate: ["number", 0],
            gravityMultiplier: ["number", 0.1],
        },
        "Rigidbody": {},
        "Collider": {
            boundingBoxSize: ["vec3", vec3.fromValues(0.5, 0.5, 0.5)],
        },
        "Timer": {
            initialDelay: ["number", 1],
            tickInterval: ["number", 0],
            maxTicks: ["number", 1],
            onTick: ["any", (ecs: ECSManager, entity: Entity, tickCount: number) => {
                const tr = ecs.getComponent(entity.id, "Transform") as TransformComponent;
                const vfx = ecs.addEntity("vfx");
                const vfxTr = ecs.getComponent(vfx.id, "Transform") as TransformComponent;
                vec3.copy(vfxTr.position, tr.position);
                ecs.removeEntity(entity.id);
            }],
        },
    },
};