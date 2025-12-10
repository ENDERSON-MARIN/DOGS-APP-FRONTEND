/* eslint-disable no-console */
const { execSync } = require("child_process");

console.log("🏗️  Building for production...");
console.log("📦 Optimizations: Enabled");
console.log("🗺️  Source maps: Disabled");
console.log("⚠️  ESLint warnings allowed");
console.log("📊 Bundle analysis: Available with build:analyze");
console.log("");

try {
  // Set environment variables and run build
  const buildEnv = {
    ...process.env,
    GENERATE_SOURCEMAP: "false",
    INLINE_RUNTIME_CHUNK: "false",
    ESLINT_NO_DEV_ERRORS: "true",
    TSC_COMPILE_ON_ERROR: "true",
  };

  execSync("craco build", {
    stdio: "inherit",
    env: buildEnv,
  });

  console.log("✅ Production build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
