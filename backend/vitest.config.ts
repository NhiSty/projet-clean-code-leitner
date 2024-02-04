/// <reference types="vitest" />
import { defineConfig } from "vite";
import swc from "unplugin-swc";

export default defineConfig({
  test: {
    include: ["./tests/**/*.test.ts", "./src/**/*.test.ts"],
    pool: "forks",
    watch: false,
    coverage: {
      provider: "v8",
      include: ["./tests/**/*.test.ts", "./src/**/*.test.ts"],
    },
  },
  plugins: [swc.vite()],
});
