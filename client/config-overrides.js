const path = require('path');

module.exports = function override(config, env) {
  // Optimization for faster builds
  if (env === 'development') {
    // Disable source maps for faster builds
    config.devtool = false;
    
    // Enable caching for faster rebuilds
    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
    };
    
    // Optimize module resolution
    config.resolve.symlinks = false;
    
    // Reduce bundle analysis for faster builds
    config.optimization = {
      ...config.optimization,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    };
    
    // Faster file watching
    config.watchOptions = {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    };
  }
  
  return config;
};
