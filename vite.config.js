import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

export default defineConfig({
  plugins: [preact()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
    dedupe: ["react", "react-dom", "zustand", "preact"],
  },
  optimizeDeps: {
    include: ["zustand", "@gravityai-dev/gravity-client"],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  server: {
    port: 3006,
    host: "0.0.0.0",
  },
});
