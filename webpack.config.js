const path = require("path");

// Webpack configuration for additional optimizations
module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
};