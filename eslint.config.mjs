import css from "@eslint/css";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { tailwind4 } from "tailwind-csstree";
import { defineConfig, globalIgnores } from "eslint/config";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "eslint.config.*",
    "postcss.config.*",
    "tailwind.config.*",
    "**/*.css",
    "ignore-me/",
    "node_modules/",
    ".eslintrc.js",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    ".graphqlrc.ts",
    "*.setup.js",
    ".prettierrc.js",
    "src/gql/**/*.ts",
    "config/**.ts",
  ]),
  ...compat.config({
    extends: ["prettier"],
  }),
  {
    files: ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
  {
    extends: [
      "js/recommended",
      eslintPluginUnicorn.configs["recommended"],
      tanstackQuery.configs["flat/recommended"],
    ],
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      prettier,
      js,
      "unused-imports": unusedImports,
      import: importPlugin,
      // '@tanstack/query': tanstackQuery,
    },
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
    },
    rules: {
      "no-var": "warn",
      "no-confusing-arrow": ["error", { allowParens: true }],
      "@typescript-eslint/ban-ts-comment": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "no-empty": "error",
      "no-implicit-coercion": [
        "error",
        {
          boolean: false,
          number: true,
          string: true,
        },
      ],
      "no-underscore-dangle": "off",
      "no-continue": "off",
      "no-void": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-empty-function": "warn",
      "no-mixed-operators": [
        "error",
        {
          allowSamePrecedence: true,
          groups: [
            ["%", "**"],
            ["%", "+"],
            ["%", "-"],
            ["%", "*"],
            ["%", "/"],
            ["/", "*"],
            ["&", "|", "^", "~", "<<", ">>", ">>>"],
            ["==", "!=", "===", "!=="],
            ["&&", "||"],
          ],
        },
      ],
      "no-plusplus": ["warn", { allowForLoopAfterthoughts: true }],
      "no-param-reassign": ["error", { props: false }],
      "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "unicorn/better-regex": "warn",
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/consistent-destructuring": "off",
      "unicorn/prefer-spread": "off",
      "unicorn/no-abusive-eslint-disable": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/no-null": "off",
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/no-rest-destructuring": "off",
      "@tanstack/query/stable-query-client": "error",
      "@next/next/no-duplicate-head": "off",
      "react/jsx-pascal-case": "error",
      "react/no-danger-with-children": "error",
      "react/jsx-fragments": "error",
      "react/jsx-no-useless-fragment": "warn",
      "react/jsx-max-depth": ["error", { max: 20 }],
      "react/jsx-curly-brace-presence": "warn",
      "react/button-has-type": "off",
      "react/display-name": "warn",
      "react/no-danger": "off",
      "react/no-typos": "warn",
      "react/function-component-definition": [
        "off",
        {
          namedComponents: "function-declaration",
        },
      ],
      "react/jsx-key": [
        "error",
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
    },
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },

  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    // extends: ['css/recommended'],
    languageOptions: {
      customSyntax: tailwind4,
      tolerant: true,
    },
    rules: {
      "css/no-empty-blocks": "error",
    },
  },

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".lintstagedrc.js",
    ],
  },
]);
