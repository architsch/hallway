import { mat4, vec2, vec3 } from "gl-matrix";
import { Component, registerComponent } from "../../ECS/Component";
import Mesh from "./Mesh";
import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";

const g = globalPropertiesConfig;
const s = g.spriteAtlasGridCellSize;

export class GraphicsComponent extends Component
{
    gl: WebGL2RenderingContext = undefined;

    applyDefaultValues()
    {
        this.gl = undefined;
    }
}
registerComponent("GraphicsComponent", () => new GraphicsComponent());

//-----------------------------------------------------------------------

export class LightComponent extends Component
{
    ambLightColor: vec3 = vec3.create();
    ambLightIntensity: number = undefined;
    spotLightColor: vec3 = vec3.create();
    spotLightIntensity: number = undefined;

    falloffStartAngle: number = undefined;
    falloffEndAngle: number = undefined;
    maxDist: number = undefined;
    linearAttenFactor: number = undefined;
    squareAttenFactor: number = undefined;

    viewMat: mat4 = mat4.create();
    projMat: mat4 = mat4.create();
    viewProjMat: mat4 = mat4.create();
    projMatrixSynced: boolean = undefined;
    viewMatrixSynced: boolean = undefined;

    applyDefaultValues()
    {
        vec3.set(this.ambLightColor, 1, 1, 1);
        this.ambLightIntensity = 0.2;
        vec3.set(this.spotLightColor, 1, 1, 1);
        this.spotLightIntensity = 0.8;

        this.falloffStartAngle = Math.PI * 0.2;
        this.falloffEndAngle = Math.PI * 0.3;
        this.maxDist = 100;
        this.linearAttenFactor = 0;
        this.squareAttenFactor = 0;

        mat4.identity(this.viewMat);
        mat4.identity(this.projMat);
        mat4.identity(this.viewProjMat);
        this.projMatrixSynced = false;
        this.viewMatrixSynced = false;
    }
}
registerComponent("LightComponent", () => new LightComponent());

//-----------------------------------------------------------------------

export class CameraComponent extends Component
{
    fovy: number = undefined;
    aspectRatio: number = undefined;
    near: number = undefined;
    far: number = undefined;

    viewMat: mat4 = mat4.create();
    projMat: mat4 = mat4.create();
    viewProjMat: mat4 = mat4.create();
    projMatrixSynced: boolean = undefined;
    viewMatrixSynced: boolean = undefined;

    applyDefaultValues()
    {
        this.fovy = 1;
        this.aspectRatio = 1;
        this.near = 0.1;
        this.far = 100;

        mat4.identity(this.viewMat);
        mat4.identity(this.projMat);
        mat4.identity(this.viewProjMat);
        this.projMatrixSynced = false;
        this.viewMatrixSynced = false;
    }
}
registerComponent("CameraComponent", () => new CameraComponent());

//-----------------------------------------------------------------------

export class MeshComponent extends Component
{
    meshConfigId: string = undefined;
    mesh: Mesh = undefined;

    applyDefaultValues()
    {
        this.meshConfigId = undefined;
        this.mesh = undefined;
    }
}
registerComponent("MeshComponent", () => new MeshComponent());

//-----------------------------------------------------------------------

export class MeshInstanceComponent extends Component
{
    meshConfigId: string = undefined;
    instanceIndex: number = undefined;
    bufferSynced: boolean = undefined;

    applyDefaultValues()
    {
        this.meshConfigId = undefined;
        this.instanceIndex = -1;
        this.bufferSynced = false;
    }
}
registerComponent("MeshInstanceComponent", () => new MeshInstanceComponent());

//-----------------------------------------------------------------------

export class SpriteComponent extends Component
{
    uvScale: vec2 = vec2.create();
    uvShift: vec2 = vec2.create();

    applyDefaultValues()
    {
        vec2.set(this.uvScale, s, s);
        vec2.set(this.uvShift, 0, 0);
    }
}
registerComponent("SpriteComponent", () => new SpriteComponent());

//-----------------------------------------------------------------------

export class AnimatedSpriteComponent extends SpriteComponent
{
    uvShiftStart: vec2 = vec2.create();
    uvShiftStep: vec2 = vec2.create();
    uvShiftMod: vec2 = vec2.create();
    framesPerSecond: number = undefined;

    applyDefaultValues()
    {
        super.applyDefaultValues();
        vec2.set(this.uvShiftStart, 0, 0);
        vec2.set(this.uvShiftStep, s, s);
        vec2.set(this.uvShiftMod, 2, 1);
        this.framesPerSecond = g.animFramesPerSecond;
    }
}
registerComponent("AnimatedSpriteComponent", () => new AnimatedSpriteComponent());

//-----------------------------------------------------------------------

export class ColorComponent extends Component
{
    color: vec3 = vec3.create();

    applyDefaultValues()
    {
        vec3.set(this.color, 1, 1, 1);
    }
}
registerComponent("ColorComponent", () => new ColorComponent());

//-----------------------------------------------------------------------