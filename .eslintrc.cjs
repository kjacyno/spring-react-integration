module.exports = {
  extends: [  "eslint:recommended",  "plugin:@typescript-eslint/recommended"
  ],
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: [".eslintrc.cjs", "vite.config.ts"],
  // TypeScript
  overrides: [
    {
      files: "**/*.+(ts|tsx)",
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      rules: {
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-loss-of-precision": "warn",
        "@typescript-eslint/no-unnecessary-type-constraint": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/no-unused-vars": "error",
      },
    },
    {
      files: ["*.ts"],
      rules: {
        // Camel case
        "filenames/match-regex": [
          2,
          "[a-z]+((d)|([A-Z][a-z]+))*([A-Z])?",
          true,
        ],
      },
    },
  ],
}
