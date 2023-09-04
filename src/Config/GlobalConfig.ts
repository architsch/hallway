import { GlobalConfig } from "./ConfigTypes";
import { uniformConfigById } from "./UniformConfigs";
import { textureConfigById } from "./TextureConfigs";
import { geometryConfigById } from "./GeometryConfigs";
import { materialConfigById } from "./MaterialConfigs";
import { meshConfigById } from "./MeshConfigs";
import { entityConfigById } from "./EntityConfigs";

export const globalConfig: GlobalConfig = {
    uniformConfigById,
    textureConfigById,
    geometryConfigById,
    materialConfigById,
    meshConfigById,
    entityConfigById,
};