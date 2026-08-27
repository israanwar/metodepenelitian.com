import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Platform Phase 0 test harness. Node environment (no DOM) is sufficient —
 * Phase 0 tests cover config/error/logging/db-lifecycle modules and API
 * route handlers, not React components.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    reporters: "default",
  },
});
