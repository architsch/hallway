import { vec3 } from "gl-matrix";

export default class Geom
{
    static reflect(vectorToReflect: vec3, reflectionSurfaceNormal: vec3, attenuationFactor: number)
    {
        const dot = vec3.dot(vectorToReflect, reflectionSurfaceNormal);
        vec3.set(vectorToReflect,
            vectorToReflect[0] - 2 * dot * reflectionSurfaceNormal[0],
            vectorToReflect[1] - 2 * dot * reflectionSurfaceNormal[1],
            vectorToReflect[2] - 2 * dot * reflectionSurfaceNormal[2]);
        vec3.scale(vectorToReflect, vectorToReflect, attenuationFactor);
    }
}