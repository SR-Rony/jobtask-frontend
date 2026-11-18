const path = require("path");
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
};
