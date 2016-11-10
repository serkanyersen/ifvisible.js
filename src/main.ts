import { IfVisible } from "./ifvisible";

declare var global: any;
const root = typeof self === "object" && self.self === self && self ||
             typeof global === "object" && global.global === global && global ||
             this;

export const ifvisible = new IfVisible(root, document);