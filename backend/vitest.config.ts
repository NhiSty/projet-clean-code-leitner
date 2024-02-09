/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import swc from "unplugin-swc";

export default defineConfig({
  test: {
    include: ["./tests/**/*.test.ts", "./src/**/*.test.ts"],
    pool: "forks",
    environment: "node",
    maxWorkers: 1,
    minWorkers: 1,
    maxConcurrency: 1,
    watch: false,
    coverage: {
      provider: "v8",
      include: ["./tests/**/*.test.ts", "./src/**/*.test.ts"],
    },
    env: loadEnv("test", process.cwd(), ""),
  },
  plugins: [swc.vite()],
});
