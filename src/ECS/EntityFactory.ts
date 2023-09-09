import { vec2, vec3 } from "gl-matrix";
import ECSManager from "./ECSManager";
import { TransformComponent } from "../Physics/Models/PhysicsComponents";
import Entity from "./Entity";
import { SpriteComponent } from "../Graphics/Models/GraphicsComponents";

const deg2rad = Math.PI / 180;
const s = 0.0625;

export default class EntityFactory
{
    static addSpriteEntity(ecs: ECSManager, entityConfigId: string,
        x: number, y: number, z: number,
        xr: number, yr: number, zr: number,
        xs: number, ys: number, zs: number,
        uScale: number, vScale: number,
        uShift: number, vShift: number)
    {
        const entity = ecs.addEntity(entityConfigId);
        this.setEntityTransformParams(ecs, entity, x, y, z, xr, yr, zr, xs, ys, zs);
        this.setEntitySpriteParams(ecs, entity, uScale, vScale, uShift, vShift);
    }

    static addTripleCube(ecs: ECSManager,
        x: number, y: number, z: number,
        xr: number, yr: number, zr: number,
        xs: number, ys: number, zs: number)
    {
        const parent = ecs.addEntity("block");
        ecs.addComponent(parent.id, "Rigidbody", {});
        this.setEntityTransformParams(ecs, parent, x, y, z, xr, yr, zr, xs, ys, zs);
        this.setEntitySpriteParams(ecs, parent, s, s, 14*s, 8*s);

        const child1 = ecs.addEntity("particle");
        ecs.setParent(child1, parent);
        this.setEntityTransformParams(ecs, child1, -0.6, 0.6, 0, 0, 0, 0, 0.5, 0.5, 0.5);
        this.setEntitySpriteParams(ecs, child1, s, s, 0, 0);

        const child2 = ecs.addEntity("particle");
        ecs.setParent(child2, parent);
        this.setEntityTransformParams(ecs, child2, +0.6, 0.6, 0, 0, 0, 0, 0.5, 0.5, 0.5);
        this.setEntitySpriteParams(ecs, child2, s, s, 0, 0);
    }

    private static setEntityTransformParams(ecs: ECSManager, entity: Entity,
        x: number, y: number, z: number,
        xr: number, yr: number, zr: number,
        xs: number, ys: number, zs: number)
    {
        const transformComponent = ecs.getComponent(entity.id, "Transform") as TransformComponent;
        vec3.set(transformComponent.position, x, y, z);
        vec3.set(transformComponent.rotation, xr, yr, zr);
        vec3.set(transformComponent.scale, xs, ys, zs);
    }

    private static setEntitySpriteParams(ecs: ECSManager, entity: Entity,
        uScale: number, vScale: number,
        uShift: number, vShift: number)
    {
        const spriteComponent = ecs.getComponent(entity.id, "Sprite") as SpriteComponent;
        vec2.set(spriteComponent.uvScale, uScale, vScale);
        vec2.set(spriteComponent.uvShift, uShift, vShift);
    }
}