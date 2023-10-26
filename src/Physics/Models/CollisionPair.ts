import { globalPropertiesConfig } from "../../Config/GlobalPropertiesConfig";
import Pool from "../../Util/Pooling/Pool";
import PoolableObject from "../../Util/Pooling/PoolableObject";

const g = globalPropertiesConfig;

export interface CollisionPair extends PoolableObject
{
    collidingEntityId: number;
    intersectionSizeX: number;
    intersectionSizeY: number;
    intersectionSizeZ: number;
    intersectionCenterX: number;
    intersectionCenterY: number;
    intersectionCenterZ: number;
}

export const CollisionPairPool = new Pool<CollisionPair>("CollisionPair", g.maxNumEstimatedCollisionPairsPerEntity * g.maxNumEntities, () => {
    return {
        collidingEntityId: -1,
        intersectionSizeX: 0,
        intersectionSizeY: 0,
        intersectionSizeZ: 0,
        intersectionCenterX: 0,
        intersectionCenterY: 0,
        intersectionCenterZ: 0,
    } as CollisionPair;
});