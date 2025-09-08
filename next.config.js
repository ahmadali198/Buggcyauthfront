// next.config.js
module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false; // disables webpack caching in development
    }
    return config;
  },
};
