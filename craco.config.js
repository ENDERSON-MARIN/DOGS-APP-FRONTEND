const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      // Performance optimizations
      if (env === "production") {
        // Production optimizations
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: "all",
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all",
                priority: 10,
              },
              common: {
                name: "common",
                minChunks: 2,
                chunks: "all",
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          },
        };

        // Disable source maps in production for better performance
        webpackConfig.devtool = false;
      } else {
        // Development optimizations
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,
        };
      }

      // Configure webpack fallbacks for Node.js core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        path: require.resolve("path-browserify"),
        fs: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        os: false,
        events: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
      };

      // Define process.env for browser environment
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          "process.env": JSON.stringify(process.env),
        })
      );

      // Cache configuration for faster rebuilds
      webpackConfig.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
      };

      return webpackConfig;
    },
  },
  devServer: {
    // Development server optimizations
    hot: true,
    compress: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};
