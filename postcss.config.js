const config = {
  plugins: [
    require("postcss-preset-env")({
      stage: 3,
      features: {
        "color-mod-function": { unresolved: "warn" },
        "nesting-rules": true,
      },
    }),
  ],
};

module.exports = config;
