import { defineConfig, type Format } from "tsup";

export default defineConfig({
  entry: { ifvisible: "src/main.ts" },
  format: ["esm", "cjs", "iife"],
  globalName: "ifvisible",
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: "es2020",
  // The IIFE/global build exposes the default singleton directly as `window.ifvisible`
  footer: ({ format }: { format: Format }) =>
    format === "iife"
      ? { js: "ifvisible = ifvisible.default || ifvisible;" }
      : {},
});
