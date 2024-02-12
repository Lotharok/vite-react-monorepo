import { service1 } from "./service1.js";
import { service2 } from "./service2.js";

export const handlers = [...service1, ...service2];
