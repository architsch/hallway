import { mat4, vec3 } from "gl-matrix";

const deg2rad = Math.PI / 180;

export default class GeometryBuilder
{
    private static positionData: number[] = [];
    private static normalData: number[] = [];
    private static uvData: number[] = [];

    private static transformStack: mat4[] = [];
    private static compositeTransform: mat4 = mat4.create();
    private static invTransCompositeTransform: mat4 = mat4.create();

    private static vec3Temp: vec3 = vec3.create();
    private static vec3Temp2: vec3 = vec3.create();

    static cube(): {positionData: number[], normalData: number[], uvData: number[]}
    {
        this.clear();
        this.addCube();
        return this.getVertexDataCopy();
    }

    static quad(): {positionData: number[], normalData: number[], uvData: number[]}
    {
        this.clear();
        this.addQuad();
        return this.getVertexDataCopy();
    }

    private static addCube()
    {
        this.pushTransform(0.0, 0.0, +0.5, 0, 0, 0, 0, 1, 1, 1); // front
        this.addQuad();
        this.popTransform();

        this.pushTransform(0.0, 0.0, -0.5, 180 * deg2rad, 0, 1, 0, 1, 1, 1); // back
        this.addQuad();
        this.popTransform();

        this.pushTransform(+0.5, 0.0, 0.0, 90 * deg2rad, 0, 1, 0, 1, 1, 1); // right
        this.addQuad();
        this.popTransform();
        
        this.pushTransform(-0.5, 0.0, 0.0, -90 * deg2rad, 0, 1, 0, 1, 1, 1); // left
        this.addQuad();
        this.popTransform();

        this.pushTransform(0.0, +0.5, 0.0, -90 * deg2rad, 1, 0, 0, 1, 1, 1); // top
        this.addQuad();
        this.popTransform();

        this.pushTransform(0.0, -0.5, 0.0, 90 * deg2rad, 1, 0, 0, 1, 1, 1); // bottom
        this.addQuad();
        this.popTransform();
    }

    private static addQuad()
    {
        this.addVertex(-0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0, 0);
        this.addVertex(-0.5, +0.5, 0.0, 0.0, 0.0, 1.0, 0, 1);
        this.addVertex(+0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1, 0);
        this.addVertex(+0.5, +0.5, 0.0, 0.0, 0.0, 1.0, 1, 1);
        this.addVertex(+0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1, 0);
        this.addVertex(-0.5, +0.5, 0.0, 0.0, 0.0, 1.0, 0, 1);
    }

    private static addVertex(positionX: number, positionY: number, positionZ: number,
        normalX: number, normalY: number, normalZ: number, u: number, v: number)
    {
        vec3.set(this.vec3Temp2, positionX, positionY, positionZ);
        vec3.transformMat4(this.vec3Temp, this.vec3Temp2, this.compositeTransform);
        this.positionData.push(this.vec3Temp[0]);
        this.positionData.push(this.vec3Temp[1]);
        this.positionData.push(this.vec3Temp[2]);

        vec3.set(this.vec3Temp2, normalX, normalY, normalZ);
        vec3.transformMat4(this.vec3Temp, this.vec3Temp2, this.invTransCompositeTransform);
        this.normalData.push(this.vec3Temp[0]);
        this.normalData.push(this.vec3Temp[1]);
        this.normalData.push(this.vec3Temp[2]);

        this.uvData.push(u);
        this.uvData.push(v);
    }

    private static pushTransform(translationX: number, translationY: number, translationZ: number,
        rotationAngle: number,
        rotationAxisX: number, rotationAxisY: number, rotationAxisZ: number,
        scaleX: number, scaleY: number, scaleZ: number)
    {
        const matrix = mat4.create();

        vec3.set(this.vec3Temp, translationX, translationY, translationZ);
        mat4.translate(matrix, matrix, this.vec3Temp);

        if (Math.abs(rotationAngle) >= 0.001)
        {
            vec3.set(this.vec3Temp, rotationAxisX, rotationAxisY, rotationAxisZ);
            mat4.rotate(matrix, matrix, rotationAngle, this.vec3Temp);
        }

        vec3.set(this.vec3Temp, scaleX, scaleY, scaleZ);
        mat4.scale(matrix, matrix, this.vec3Temp);

        this.transformStack.push(matrix);
        mat4.multiply(this.compositeTransform, matrix, this.compositeTransform);

        mat4.invert(this.invTransCompositeTransform, this.compositeTransform);
        mat4.transpose(this.invTransCompositeTransform, this.invTransCompositeTransform);
    }

    private static popTransform()
    {
        const transform = this.transformStack.pop();
        let inverseTransform = mat4.create();
        mat4.invert(inverseTransform, transform);
        mat4.multiply(this.compositeTransform, inverseTransform, this.compositeTransform);

        mat4.invert(this.invTransCompositeTransform, this.compositeTransform);
        mat4.transpose(this.invTransCompositeTransform, this.invTransCompositeTransform);
    }

    private static clear()
    {
        this.positionData.length = 0;
        this.normalData.length = 0;
        this.uvData.length = 0;

        this.transformStack.length = 0;
        mat4.identity(this.compositeTransform);
    }

    private static getVertexDataCopy(): {positionData: number[], normalData: number[], uvData: number[]}
    {
        const positionDataCopy = new Array<number>(this.positionData.length);
        const normalDataCopy = new Array<number>(this.normalData.length);
        const uvDataCopy = new Array<number>(this.uvData.length);

        for (let i = 0; i < this.positionData.length; ++i)
            positionDataCopy[i] = this.positionData[i];
        for (let i = 0; i < this.normalData.length; ++i)
            normalDataCopy[i] = this.normalData[i];
        for (let i = 0; i < this.uvData.length; ++i)
            uvDataCopy[i] = this.uvData[i];

        return {positionData: positionDataCopy, normalData: normalDataCopy, uvData: uvDataCopy};
    }
}