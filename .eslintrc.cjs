module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "next",
    "prettier",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint", "react-refresh"],
  rules: {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
    ]
  },
};
