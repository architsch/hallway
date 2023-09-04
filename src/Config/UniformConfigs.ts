import ECSManager from "../ECS/ECSManager";
import { CameraComponent, LightComponent } from "../Graphics/Models/Components";
import { UniformConfig } from "./ConfigTypes";

const getCamera = (ecs: ECSManager) => ecs.singletonComponents().get("Camera") as CameraComponent;
const getLight = (ecs: ECSManager) => ecs.singletonComponents().get("Light") as LightComponent;

export const uniformConfigById: {[id: string]: UniformConfig} = {
    "u_cameraViewProj": {
        type: "mat4",
        getCurrentValue: (ecs: ECSManager) => getCamera(ecs).viewProjMat,
    },
    "u_ambLightColor": {
        type: "vec3",
        getCurrentValue: (ecs: ECSManager) => getLight(ecs).ambLightColor,
    },
    "u_ambLightIntensity": {
        type: "float",
        getCurrentValue: (ecs: ECSManager) => getLight(ecs).ambLightIntensity,
    },
    "u_spotLightPosition": {
        type: "vec3",
        getCurrentValue: (ecs: ECSManager) => getLight(ecs).position,
    },
    "u_spotLightColor": {
        type: "vec3",
        getCurrentValue: (ecs: ECSManager) => getLight(ecs).spotLightColor,
    },
    "u_spotLightIntensity": {
        type: "float",
        getCurrentValue: (ecs: ECSManager) => getLight(ecs).spotLightIntensity,
    },
    "u_spotLightViewProjMat": {
        type: "mat4",
        getCurrentValue: (ecs: ECSManager) => getLight(ecs).viewProjMat,
    },
};