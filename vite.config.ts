import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "8d-tools",
      fileName: "main",
      formats: ["es"],
    },
    outDir: "dist",
    rollupOptions: {
      external: ["commander", "chalk", "fs-extra", "path", "fs", "os", "util"],
      output: {
        banner: "#!/usr/bin/env node",
        format: "es",
      },
    },
    target: "node18",
    minify: false,
    ssr: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  define: {
    __dirname: "import.meta.dirname",
  },
});
