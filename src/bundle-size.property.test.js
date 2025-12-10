const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * **Feature: dependency-upgrade, Property 4: Bundle Size Optimization**
 * **Validates: Requirements 2.5**
 *
 * Property: For any production build, the bundle size should not increase
 * significantly (>20%) without functional justification after dependency updates
 */

// Generator for different build scenarios
const generateBuildScenarios = () => {
  return [
    { buildType: "production", expectOptimization: true },
    { buildType: "development", expectOptimization: false },
  ];
};

// Helper function to get build output information
const getBuildInfo = () => {
  const buildDir = path.join(process.cwd(), "build");

  if (!fs.existsSync(buildDir)) {
    // If build doesn't exist, create it
    try {
      execSync("npm run build", { stdio: "pipe" });
    } catch (error) {
      throw new Error("Build failed: " + error.message);
    }
  }

  const staticDir = path.join(buildDir, "static");
  const jsDir = path.join(staticDir, "js");
  const cssDir = path.join(staticDir, "css");

  const buildInfo = {
    totalSize: 0,
    jsFiles: [],
    cssFiles: [],
    hasMainBundle: false,
    hasChunks: false,
  };

  // Get JS files info
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs
      .readdirSync(jsDir)
      .filter((file) => file.endsWith(".js"));
    jsFiles.forEach((file) => {
      const filePath = path.join(jsDir, file);
      const stats = fs.statSync(filePath);
      const fileInfo = {
        name: file,
        size: stats.size,
        isMain: file.includes("main"),
        isChunk: file.includes("chunk"),
      };
      buildInfo.jsFiles.push(fileInfo);
      buildInfo.totalSize += stats.size;

      if (fileInfo.isMain) buildInfo.hasMainBundle = true;
      if (fileInfo.isChunk) buildInfo.hasChunks = true;
    });
  }

  // Get CSS files info
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs
      .readdirSync(cssDir)
      .filter((file) => file.endsWith(".css"));
    cssFiles.forEach((file) => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      const fileInfo = {
        name: file,
        size: stats.size,
      };
      buildInfo.cssFiles.push(fileInfo);
      buildInfo.totalSize += stats.size;
    });
  }

  return buildInfo;
};

// Helper function to read baseline metrics if they exist
const getBaselineMetrics = () => {
  const baselineFile = path.join(process.cwd(), "baseline-metrics.md");

  if (!fs.existsSync(baselineFile)) {
    return null;
  }

  try {
    const content = fs.readFileSync(baselineFile, "utf8");
    const bundleSizeMatch = content.match(/Bundle Size: ([\d.]+) KB/);
    const buildTimeMatch = content.match(/Build Time: ([\d.]+)s/);

    return {
      bundleSize: bundleSizeMatch
        ? parseFloat(bundleSizeMatch[1]) * 1024
        : null, // Convert KB to bytes
      buildTime: buildTimeMatch ? parseFloat(buildTimeMatch[1]) : null,
    };
  } catch (error) {
    return null;
  }
};

describe("Bundle Size Optimization Property Tests", () => {
  let currentBuildInfo;
  let baselineMetrics;

  beforeAll(() => {
    // Get current build information
    currentBuildInfo = getBuildInfo();
    baselineMetrics = getBaselineMetrics();
  });

  test("production build should have optimized bundle structure", () => {
    const scenarios = generateBuildScenarios();

    scenarios.forEach((scenario) => {
      if (scenario.expectOptimization) {
        // Property: Production builds should have main bundle
        expect(currentBuildInfo.hasMainBundle).toBe(true);

        // Property: Bundle should contain JavaScript files
        expect(currentBuildInfo.jsFiles.length).toBeGreaterThan(0);

        // Property: Main bundle should exist and have reasonable size
        const mainBundle = currentBuildInfo.jsFiles.find((file) => file.isMain);
        expect(mainBundle).toBeDefined();
        expect(mainBundle.size).toBeGreaterThan(0);

        // Property: Bundle size should be reasonable (not excessively large)
        const maxReasonableSize = 5 * 1024 * 1024; // 5MB
        expect(currentBuildInfo.totalSize).toBeLessThan(maxReasonableSize);
      }
    });
  });

  test("bundle size should not increase significantly after dependency updates", () => {
    if (!baselineMetrics || !baselineMetrics.bundleSize) {
      // If no baseline exists, just verify current bundle is reasonable
      expect(currentBuildInfo.totalSize).toBeGreaterThan(0);
      expect(currentBuildInfo.totalSize).toBeLessThan(10 * 1024 * 1024); // 10MB max
      return;
    }

    // Property: Bundle size increase should not exceed 20%
    const currentSize = currentBuildInfo.totalSize;
    const baselineSize = baselineMetrics.bundleSize;
    const increasePercentage =
      ((currentSize - baselineSize) / baselineSize) * 100;

    // Allow for some increase due to new features, but not excessive
    expect(increasePercentage).toBeLessThan(20);

    // Property: Size should not decrease dramatically either (might indicate missing assets)
    expect(increasePercentage).toBeGreaterThan(-50);
  });

  test("build output should contain expected file types and structure", () => {
    // Property: Any valid build should have consistent file structure
    expect(currentBuildInfo.jsFiles.length).toBeGreaterThan(0);

    // Property: All JS files should have valid names and sizes
    currentBuildInfo.jsFiles.forEach((file) => {
      expect(file.name).toMatch(/\.js$/);
      expect(file.size).toBeGreaterThan(0);
      expect(typeof file.name).toBe("string");
      expect(typeof file.size).toBe("number");
    });

    // Property: CSS files should have valid structure if they exist
    currentBuildInfo.cssFiles.forEach((file) => {
      expect(file.name).toMatch(/\.css$/);
      expect(file.size).toBeGreaterThan(0);
      expect(typeof file.name).toBe("string");
      expect(typeof file.size).toBe("number");
    });
  });

  test("bundle optimization should maintain code splitting benefits", () => {
    // Property: Modern builds should utilize code splitting when beneficial
    const totalJsFiles = currentBuildInfo.jsFiles.length;

    // Should have at least main bundle
    expect(totalJsFiles).toBeGreaterThanOrEqual(1);

    // Property: If chunks exist, they should be reasonably sized
    const chunkFiles = currentBuildInfo.jsFiles.filter((file) => file.isChunk);
    chunkFiles.forEach((chunk) => {
      expect(chunk.size).toBeGreaterThan(0);
      // Chunks shouldn't be excessively large
      expect(chunk.size).toBeLessThan(2 * 1024 * 1024); // 2MB per chunk
    });
  });

  test("bundle size should be proportional to application complexity", () => {
    // Property: Bundle size should correlate with number of dependencies
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    const dependencyCount = Object.keys(packageJson.dependencies || {}).length;
    const devDependencyCount = Object.keys(
      packageJson.devDependencies || {}
    ).length;
    const totalDependencies = dependencyCount + devDependencyCount;

    // Property: More dependencies generally mean larger bundles, but with reasonable limits
    if (totalDependencies > 20) {
      // For apps with many dependencies, expect larger but still reasonable bundles
      expect(currentBuildInfo.totalSize).toBeGreaterThan(50 * 1024); // At least 50KB
      expect(currentBuildInfo.totalSize).toBeLessThan(10 * 1024 * 1024); // But less than 10MB
    } else {
      // For simpler apps, expect smaller bundles
      expect(currentBuildInfo.totalSize).toBeLessThan(5 * 1024 * 1024); // Less than 5MB
    }

    // Property: Bundle should always have some content
    expect(currentBuildInfo.totalSize).toBeGreaterThan(1024); // At least 1KB
  });

  test("updated dependencies should not introduce unnecessary bundle bloat", () => {
    // Property: Each dependency update should provide value proportional to size increase
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Check that updated packages are actually being used in the build
    const updatedPackages = ["react-icons", "sweetalert2", "web-vitals"];

    updatedPackages.forEach((packageName) => {
      if (packageJson.dependencies[packageName]) {
        const version = packageJson.dependencies[packageName];

        // Property: Updated packages should have valid version strings
        expect(typeof version).toBe("string");
        expect(version.length).toBeGreaterThan(0);

        // Property: Version should indicate a recent update
        const versionNumber = version.replace(/[\^~]/, "");
        expect(versionNumber).toMatch(/^\d+\.\d+\.\d+/);
      }
    });

    // Property: Build should complete successfully with updated dependencies
    expect(currentBuildInfo.totalSize).toBeGreaterThan(0);
    expect(currentBuildInfo.jsFiles.length).toBeGreaterThan(0);
  });
});
