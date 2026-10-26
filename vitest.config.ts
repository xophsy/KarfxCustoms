import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: {
    include: ["tests/**/*.test.ts"],
    // Blank DATABASE_URL keeps tests on the in-process database, never a real one.
    env: { DATABASE_URL: "", SESSION_PEPPER: "test-pepper" },
  },
});
