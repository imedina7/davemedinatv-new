import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// https://vitest.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    root: "./src",
    include: ["**/*.spec.ts", "../api/**/*.spec.ts"],
    setupFiles: ["./test-setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
      exclude: [
        "**/*.spec.ts",
        "**/node_modules/**",
        "**/dist/**",
        "**/test-utils/**",
      ],
    } as any,
  },
});
