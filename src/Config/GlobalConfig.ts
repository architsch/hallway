import { GlobalConfig } from "./ConfigTypes";
import { uniformConfigById } from "../Graphics/Configs/UniformConfigs";
import { textureConfigById } from "../Graphics/Configs/TextureConfigs";
import { geometryConfigById } from "../Graphics/Configs/GeometryConfigs";
import { materialConfigById } from "../Graphics/Configs/MaterialConfigs";
import { meshConfigById } from "../Graphics/Configs/MeshConfigs";
import { entityConfigById } from "../ECS/Configs/EntityConfigs";

export const globalConfig: GlobalConfig = {
    uniformConfigById,
    textureConfigById,
    geometryConfigById,
    materialConfigById,
    meshConfigById,
    entityConfigById,
};