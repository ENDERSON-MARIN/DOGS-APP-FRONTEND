/* eslint-disable no-console */
const { execSync } = require("child_process");

console.log("🚀 Starting development server with optimizations...");
console.log("📝 Environment: Development");
console.log("🔥 Hot reload: Enabled");
console.log("🗺️  Source maps: Enabled");
console.log("⚡ Fast refresh: Enabled");
console.log("🌐 Server: http://localhost:3000");
console.log("");

try {
  execSync("cross-env GENERATE_SOURCEMAP=true FAST_REFRESH=true craco start", {
    stdio: "inherit",
    env: { ...process.env, GENERATE_SOURCEMAP: "true", FAST_REFRESH: "true" },
  });
} catch (error) {
  console.error("❌ Failed to start development server:", error.message);
  process.exit(1);
}
