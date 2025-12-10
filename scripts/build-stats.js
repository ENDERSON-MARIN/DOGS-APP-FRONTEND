/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

// Script para gerar estatísticas do build
function getBuildStats() {
  const buildDir = path.join(__dirname, "../build");

  if (!fs.existsSync(buildDir)) {
    console.log("❌ Build directory not found. Run 'npm run build' first.");
    return;
  }

  const staticDir = path.join(buildDir, "static");
  let totalSize = 0;
  let fileCount = 0;

  function calculateSize(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stats.size;
        fileCount++;
      }
    });
  }

  calculateSize(staticDir);

  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

  console.log("📊 Build Statistics:");
  console.log(`   Total files: ${fileCount}`);
  console.log(`   Total size: ${sizeInMB} MB`);
  console.log(`   Build completed at: ${new Date().toLocaleString()}`);
}

getBuildStats();
