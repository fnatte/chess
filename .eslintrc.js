module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["airbnb-base", "prettier", "prettier/react"],
  plugins: ["jsx"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "jsx/uses-factory": [1, { pragma: "html" }],
    "jsx/factory-in-scope": [1, { pragma: "html" }],
    "jsx/mark-used-vars": 1,
    "jsx/no-undef": 1,
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["postcss.config.js", "**/*.spec.js"] },
    ],
  },
  overrides: [
    {
      files: "*.spec.js",
      env: {
        jest: true,
        es2020: true,
      },
    },
  ],
};
