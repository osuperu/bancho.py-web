import path from "node:path"
import { fileURLToPath } from "node:url"

import { fixupConfigRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "eslint/config"
import checkFile from "eslint-plugin-check-file"
import simpleImportSort from "eslint-plugin-simple-import-sort"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    extends: fixupConfigRules(
      compat.extends(
        "react-app",
        "react-app/jest",
        "prettier",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended",
        "plugin:import/typescript",
        "plugin:react/jsx-runtime"
      )
    ),

    plugins: {
      "check-file": checkFile,
      "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "check-file/no-index": "off",
      "import/no-unresolved": "off",

      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: false,
          shorthandFirst: true,
          multiline: "ignore",
          ignoreCase: true,
          noSortAlphabetically: true,
          reservedFirst: true,
        },
      ],

      "import/no-default-export": "off",

      "react/forbid-elements": [
        "error",
        {
          forbid: [
            {
              element: "h1",
              message: "Use @materialui <Typography /> instead of <h1 />",
            },
            {
              element: "h2",
              message: "Use @materialui <Typography /> instead of <h2 />",
            },
            {
              element: "h3",
              message: "Use @materialui <Typography /> instead of <h3 />",
            },
            {
              element: "h4",
              message: "Use @materialui <Typography /> instead of <h4 />",
            },
            {
              element: "h5",
              message: "Use @materialui <Typography /> instead of <h5 />",
            },
            {
              element: "h6",
              message: "Use @materialui <Typography /> instead of <h5 />",
            },
            {
              element: "p",
              message: "Use @materialui <Typography /> instead of <p />",
            },
            {
              element: "div",
              message: "Use @materialui <Box /> instead of <div />",
            },
            {
              element: "grid",
              message: "Use @materialui <Grid /> instead of <grid />",
            },
            {
              element: "button",
              message: "Use @materialui <Button /> instead of <button />",
            },
          ],
        },
      ],

      "react/jsx-pascal-case": [
        "error",
        {
          allowAllCaps: false,
          allowLeadingUnderscore: false,
          allowNamespace: false,
        },
      ],

      "react/jsx-boolean-value": ["warn", "never"],

      "react/forbid-component-props": [
        "error",
        {
          forbid: ["className", "style"],
        },
      ],

      "react/forbid-dom-props": [
        "error",
        {
          forbid: ["className", "style"],
        },
      ],

      "import/no-duplicates": [
        "error",
        {
          "prefer-inline": true,
        },
      ],
    },
  },
])
