const postcssPresetEnv = require("postcss-preset-env");
const postcssNormalize = require("postcss-normalize");

const config = {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: {
        "color-mod-function": { unresolved: "warn" },
        "nesting-rules": true,
      },
    }),
    postcssNormalize(),
  ],
};

module.exports = config;
