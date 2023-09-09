import { GlobalConfig } from "./ConfigTypes";
import { uniformConfigById } from "../Graphics/Configs/UniformConfigs";
import { textureConfigById } from "../Graphics/Configs/TextureConfigs";
import { geometryConfigById } from "../Graphics/Configs/GeometryConfigs";
import { materialConfigById } from "../Graphics/Configs/MaterialConfigs";
import { meshConfigById } from "../Graphics/Configs/MeshConfigs";
import { entityConfigById } from "../ECS/Configs/EntityConfigs";
import { globalPropertiesConfig } from "./GlobalPropertiesConfig";

export const globalConfig: GlobalConfig = {
    globalPropertiesConfig,
    uniformConfigById,
    textureConfigById,
    geometryConfigById,
    materialConfigById,
    meshConfigById,
    entityConfigById,
};