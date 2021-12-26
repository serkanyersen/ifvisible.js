import { IfVisible } from "./ifvisible";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;
// decide between self vs global depending on the environment
const root =
  (typeof self === "object" && self.self === self && self) ||
  (typeof global === "object" && global.global === global && global) ||
  this;

export const ifvisible = new IfVisible(root, document);
