import { EntityConfig, GlobalConfig } from "./ConfigTypes";
import { uniformConfigById } from "../Graphics/Configs/UniformConfigs";
import { textureConfigById } from "../Graphics/Configs/TextureConfigs";
import { geometryConfigById } from "../Graphics/Configs/GeometryConfigs";
import { materialConfigById } from "../Graphics/Configs/MaterialConfigs";
import { meshConfigById } from "../Graphics/Configs/MeshConfigs";
import { coreEntityConfigById } from "../ECS/Configs/CoreEntityConfigs";
import { globalPropertiesConfig } from "./GlobalPropertiesConfig";
import { dynamicEntityConfigById } from "../ECS/Configs/DynamicEntityConfigs";
import { staticEntityConfigById } from "../ECS/Configs/StaticEntityConfigs";
import { vfxEntityConfigById } from "../ECS/Configs/VFXEntityConfigs";

const entityConfigById: {[id: string]: EntityConfig} = {};
Object.assign(entityConfigById, coreEntityConfigById);
Object.assign(entityConfigById, dynamicEntityConfigById);
Object.assign(entityConfigById, staticEntityConfigById);
Object.assign(entityConfigById, vfxEntityConfigById);

export const globalConfig: GlobalConfig = {
    globalPropertiesConfig,
    uniformConfigById,
    textureConfigById,
    geometryConfigById,
    materialConfigById,
    meshConfigById,
    entityConfigById,
};