import { EntityConfig, GlobalConfig } from "./ConfigTypes";
import { uniformConfigById } from "../Graphics/Configs/UniformConfigs";
import { textureConfigById } from "../Graphics/Configs/TextureConfigs";
import { geometryConfigById } from "../Graphics/Configs/GeometryConfigs";
import { materialConfigById } from "../Graphics/Configs/MaterialConfigs";
import { meshConfigById } from "../Graphics/Configs/MeshConfigs";
import { coreEntityConfigById } from "../Game/Configs/CoreEntityConfigs";
import { globalPropertiesConfig } from "./GlobalPropertiesConfig";
import { dynamicEntityConfigById } from "../Game/Configs/DynamicEntityConfigs";

const entityConfigById: {[id: string]: EntityConfig} = {};
Object.assign(entityConfigById, coreEntityConfigById);
Object.assign(entityConfigById, dynamicEntityConfigById);

export const globalConfig: GlobalConfig = {
    globalPropertiesConfig,
    uniformConfigById,
    textureConfigById,
    geometryConfigById,
    materialConfigById,
    meshConfigById,
    entityConfigById,
};