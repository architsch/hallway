import { mat4, vec3 } from "gl-matrix";

export default class GLCamera
{
    private position: vec3;
    private target: vec3;
    private up: vec3;
    private matrixSynced: boolean;
    private viewProjMatrix: mat4;
    private viewMatrix: mat4;
    private projMatrix: mat4;

    constructor(fovy: number, aspectRatio: number, near: number, far: number)
    {
        this.position = vec3.create();
        vec3.set(this.position, 0, 0, 0);

        this.target = vec3.create();
        vec3.set(this.target, 0, 0, -1);

        this.up = vec3.create();
        vec3.set(this.up, 0, 1, 0);

        this.matrixSynced = false;
        this.viewProjMatrix = mat4.create();
        this.viewMatrix = mat4.create();

        this.projMatrix = mat4.create();
        mat4.perspective(this.projMatrix, fovy, aspectRatio, near, far);
    }

    isMatrixSynced(): boolean
    {
        return this.matrixSynced;
    }

    syncMatrix()
    {
        mat4.lookAt(this.viewMatrix, this.target, this.position, this.up);
        mat4.multiply(this.viewProjMatrix, this.projMatrix, this.viewMatrix);
        this.matrixSynced = true;
    }

    getViewProjMatrix(): mat4
    {
        return this.viewProjMatrix;
    }

    getPosition(): vec3
    {
        return this.position;
    }

    getTarget(): vec3
    {
        return this.target;
    }

    setPosition(x: number, y: number, z: number)
    {
        vec3.set(this.position, x, y, z);
        this.matrixSynced = false;
    }

    setTarget(x: number, y: number, z: number)
    {
        vec3.set(this.target, x, y, z);
        this.matrixSynced = false;
    }
}