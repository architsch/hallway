import Pool from "../Util/Pooling/Pool";
import { Component } from "./Component";

const ComponentPools: {[componentType: string]: Pool<Component>} = {};
export default ComponentPools;