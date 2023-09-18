import { mat4, vec2, vec3 } from "gl-matrix";
import VerticesData from "../Models/VerticesData";

const deg2rad = Math.PI / 180;

export default class GeometryVerticesFactory
{
    private static positionData: number[] = [];
    private static normalData: number[] = [];
    private static uvData: number[] = [];

    private static currUVRange: vec2 = vec2.create();
    private static transformStack: mat4[] = [];
    private static compositeTransform: mat4 = mat4.create();
    private static invTransCompositeTransform: mat4 = mat4.create();

    private static vec3Temp: vec3 = vec3.create();
    private static vec3Temp2: vec3 = vec3.create();

    static cuboid(xSize: number, ySize: number, zSize: number, uRange: number, vRange: number): VerticesData
    {
        this.clear();
        this.setUVRange(uRange, vRange);
        this.pushTransform(0, 0, 0, 0, 0, 0, 0, xSize, ySize, zSize);
        this.addCuboid();
        this.popTransform();
        return this.getVertexDataCopy();
    }

    static quad(xSize: number, ySize: number, uRange: number, vRange: number): VerticesData
    {
        this.clear();
        this.setUVRange(uRange, vRange);
        this.pushTransform(0, 0, 0, 0, 0, 0, 0, xSize, ySize, 1);
        this.addQuad();
        this.popTransform();
        return this.getVertexDataCopy();
    }

    private static addCuboid()
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
        const u = this.currUVRange[0];
        const v = this.currUVRange[1];
        this.addVertex(-0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0, 0);
        this.addVertex(-0.5, +0.5, 0.0, 0.0, 0.0, 1.0, 0, v);
        this.addVertex(+0.5, -0.5, 0.0, 0.0, 0.0, 1.0, u, 0);
        this.addVertex(+0.5, +0.5, 0.0, 0.0, 0.0, 1.0, u, v);
        this.addVertex(+0.5, -0.5, 0.0, 0.0, 0.0, 1.0, u, 0);
        this.addVertex(-0.5, +0.5, 0.0, 0.0, 0.0, 1.0, 0, v);
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

    private static setUVRange(uRange: number, vRange: number)
    {
        vec2.set(this.currUVRange, uRange, vRange);
    }

    private static pushTransform(translationX: number, translationY: number, translationZ: number,
        rotationAngle: number,
        rotationAxisX: number, rotationAxisY: number, rotationAxisZ: number,
        scaleX: number, scaleY: number, scaleZ: number)
    {
        const matrix = mat4.create();

        if (translationX != 0 || translationY != 0 || translationZ != 0)
        {
            vec3.set(this.vec3Temp, translationX, translationY, translationZ);
            mat4.translate(matrix, matrix, this.vec3Temp);
        }
        if (Math.abs(rotationAngle) >= 0.001)
        {
            vec3.set(this.vec3Temp, rotationAxisX, rotationAxisY, rotationAxisZ);
            mat4.rotate(matrix, matrix, rotationAngle, this.vec3Temp);
        }
        if (scaleX != 1 || scaleY != 1 || scaleZ != 1)
        {
            vec3.set(this.vec3Temp, scaleX, scaleY, scaleZ);
            mat4.scale(matrix, matrix, this.vec3Temp);
        }

        this.transformStack.push(matrix);
        mat4.multiply(this.compositeTransform, this.compositeTransform, matrix);

        mat4.invert(this.invTransCompositeTransform, this.compositeTransform);
        mat4.transpose(this.invTransCompositeTransform, this.invTransCompositeTransform);
    }

    private static popTransform()
    {
        const transform = this.transformStack.pop();
        let inverseTransform = mat4.create();
        mat4.invert(inverseTransform, transform);
        mat4.multiply(this.compositeTransform, this.compositeTransform, inverseTransform);

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

    private static getVertexDataCopy(): VerticesData
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