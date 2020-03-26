module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "@typescript-eslint",
        "react"
    ],
    "ignorePatterns": [
        "src/**/*.spec.ts"
    ],
    "rules": {
        "semi": "error",
        "no-console": "error",
        "no-debugger": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": "error",
        "no-empty": "error",
        "no-eval": "error",
        "no-invalid-this": "error",
        "no-irregular-whitespace": "error",
        "no-multiple-empty-lines": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": [
            "error",
            "never"
        ],
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-object-spread": "error",
        "prefer-template": "error",
        "radix": "error",
        "no-else-return": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
          "vars": "all",
          "args": "after-used",
          "ignoreRestSiblings": false
        }],

        "react/display-name": "off",
    },
    "extends": [
        "plugin:react/recommended",
        "plugin:prettier/recommended"
    ],
    "settings": {
        "react": {
            "pragma": "React",
            "version": "detect"
        }
    }
};
