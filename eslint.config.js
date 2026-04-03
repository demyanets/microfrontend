// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      // === Disable preset rules not in original tslint config ===
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-inferrable-types": "off",  // original tslint had this OFF
      "@typescript-eslint/consistent-type-assertions": "off", // original used angle-bracket style
      "@typescript-eslint/ban-tslint-comment": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/no-unused-vars": "off", // not in original tslint config
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "no-prototype-builtins": "off",
      "no-useless-assignment": "off",

      // === TypeScript rules (migrated from tslint.json) ===

      // adjacent-overload-signatures
      "@typescript-eslint/adjacent-overload-signatures": "error",

      // ban-types
      "@typescript-eslint/no-restricted-types": ["error", {
        types: {
          Object: { message: "Use {} instead.", fixWith: "{}" },
          String: { message: "Use string instead.", fixWith: "string" },
        },
      }],

      // member-ordering
      "@typescript-eslint/member-ordering": ["error", {
        default: ["static-field", "instance-field", "constructor"],
      }],

      // no-any
      "@typescript-eslint/no-explicit-any": "error",

      // no-empty-interface
      "@typescript-eslint/no-empty-interface": "error",

      // import-blacklist: only block bare "rxjs" imports, allow sub-modules
      "no-restricted-imports": ["error", {
        paths: [{
          name: "rxjs",
          message: "Import from rxjs sub-modules (e.g. rxjs/operators) instead of the top-level rxjs package.",
        }],
      }],

      // no-namespace
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],

      // no-non-null-assertion
      "@typescript-eslint/no-non-null-assertion": "error",

      // no-var-requires / no-require-imports
      "@typescript-eslint/no-require-imports": "error",

      // only-arrow-functions
      "prefer-arrow-callback": "error",

      // prefer-const
      "prefer-const": "error",

      // no-magic-numbers
      "@typescript-eslint/no-magic-numbers": ["warn", {
        ignore: [-1, 0, 1],
        ignoreEnums: true,
        ignoreReadonlyClassProperties: true,
      }],

      // === Functionality rules ===

      // curly
      "curly": "error",

      // forin
      "guard-for-in": "error",

      // no-arg
      "no-caller": "error",

      // no-bitwise
      "no-bitwise": "error",

      // no-console
      "no-console": ["error", { allow: ["warn", "debug", "trace"] }],

      // no-construct
      "no-new-wrappers": "error",

      // no-debugger
      "no-debugger": "error",

      // no-empty
      "no-empty": "error",

      // no-eval
      "no-eval": "error",

      // no-floating-promises
      "@typescript-eslint/no-floating-promises": "error",

      // await-promise
      "@typescript-eslint/await-thenable": "error",

      // no-for-in-array
      "@typescript-eslint/no-for-in-array": "error",

      // no-invalid-template-strings
      "no-template-curly-in-string": "error",

      // no-invalid-this
      "no-invalid-this": "off",
      "@typescript-eslint/no-invalid-this": "error",

      // no-misused-new
      "@typescript-eslint/no-misused-new": "error",

      // no-shadowed-variable
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",

      // no-sparse-arrays
      "no-sparse-arrays": "error",

      // no-string-throw
      "no-throw-literal": "off",
      "@typescript-eslint/only-throw-error": "error",

      // no-switch-case-fall-through
      "no-fallthrough": "error",

      // no-unbound-method
      "@typescript-eslint/unbound-method": "error",

      // no-unsafe-finally
      "no-unsafe-finally": "error",

      // no-unused-expression
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",

      // no-var-keyword
      "no-var": "error",

      // restrict-plus-operands
      "@typescript-eslint/restrict-plus-operands": "error",

      // triple-equals
      "eqeqeq": ["error", "always", { null: "ignore" }],

      // use-isnan
      "use-isnan": "error",

      // switch-default
      "default-case": "error",

      // === Maintainability rules ===

      // cyclomatic-complexity
      "complexity": ["error", 10],

      // max-classes-per-file
      "max-classes-per-file": ["error", 1],

      // max-file-line-count
      "max-lines": ["error", { max: 500, skipBlankLines: true, skipComments: true }],

      // max-line-length (leave to Prettier mostly, but set as warning)
      "max-len": ["warn", { code: 150 }],

      // no-parameter-reassignment
      "no-param-reassign": "error",

      // trailing-comma
      "comma-dangle": ["error", "never"],

      // === Style rules ===

      // arrow-parens
      "arrow-parens": ["error", "always"],

      // class-name (PascalCase) — handled by @typescript-eslint/naming-convention
      "@typescript-eslint/naming-convention": ["error",
        { selector: "class", format: ["PascalCase"] },
        { selector: "interface", format: ["PascalCase"], prefix: ["I"] },
      ],

      // prefer-template
      "prefer-template": "warn",

      // quotemark — leave to Prettier
      // semicolons — leave to Prettier

      // no-consecutive-blank-lines
      "no-multiple-empty-lines": ["error", { max: 2 }],

      // === Ban rules (jQuery/Underscore/AngularJS) ===
      "no-restricted-globals": ["error",
        { name: "$", message: "Do not use jQuery." },
        { name: "jQuery", message: "Do not use jQuery." },
      ],

      "no-restricted-properties": ["error",
        { object: "_", property: "each", message: "Use native array.forEach instead." },
        { object: "_", property: "forEach", message: "Use native array.forEach instead." },
        { object: "_", property: "map", message: "Use native array.map instead." },
        { object: "_", property: "collect", message: "Use native array.map instead." },
        { object: "_", property: "filter", message: "Use native array.filter instead." },
        { object: "_", property: "select", message: "Use native array.filter instead." },
        { object: "_", property: "reduce", message: "Use native array.reduce instead." },
        { object: "_", property: "inject", message: "Use native array.reduce instead." },
        { object: "_", property: "foldl", message: "Use native array.reduce instead." },
        { object: "_", property: "reduceRight", message: "Use native array.reduceRight instead." },
        { object: "_", property: "foldr", message: "Use native array.reduceRight instead." },
        { object: "_", property: "some", message: "Use native array.some instead." },
        { object: "_", property: "any", message: "Use native array.some instead." },
        { object: "_", property: "every", message: "Use native array.every instead." },
        { object: "_", property: "all", message: "Use native array.every instead." },
        { object: "_", property: "indexOf", message: "Use native array.indexOf instead." },
        { object: "_", property: "lastIndexOf", message: "Use native array.lastIndexOf instead." },
        { object: "_", property: "includes", message: "Use native array.includes instead." },
        { object: "_", property: "contains", message: "Use native array.includes instead." },
        { object: "_", property: "keys", message: "Use native Object.keys instead." },
        { object: "_", property: "values", message: "Use Object.keys(obj).map(key => obj[key]) instead." },
        { object: "_", property: "size", message: "Use native array.length or Object.keys().length instead." },
        { object: "_", property: "pluck", message: "Use native array.map(x => x.prop) instead." },
        { object: "_", property: "clone", message: "Use structuredClone or spread syntax instead." },
        { object: "_", property: "extend", message: "Use Object.assign or spread syntax instead." },
        { object: "_", property: "isNull", message: "Use native == null check instead." },
        { object: "_", property: "isUndefined", message: "Use native == undefined check instead." },
        { object: "_", property: "isNaN", message: "Use native isNaN instead." },
        { object: "_", property: "reverse", message: "Use native array.reverse instead." },
        { object: "_", property: "join", message: "Use native array.join instead." },
        { object: "_", property: "toUpper", message: "Use native string.toUpperCase instead." },
        { object: "_", property: "toLower", message: "Use native string.toLowerCase instead." },
        { object: "_", property: "trim", message: "Use native string.trim instead." },
        { object: "_", property: "after", message: "Can be done natively without Underscore." },
      ],

      // === Angular rules ===
      "@angular-eslint/directive-selector": ["error", {
        type: "attribute",
        prefix: "lib",
        style: "camelCase",
      }],
      "@angular-eslint/component-selector": ["error", {
        type: "element",
        prefix: "lib",
        style: "kebab-case",
      }],
    },
  },
  {
    // Relax rules in test/mock files (were excluded from tslint linting)
    files: ["**/*.spec.ts", "**/mocks/**/*.ts", "**/test.ts"],
    rules: {
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "no-console": "off",
      "max-lines": "off",
    },
  },
  {
    // Override selector prefix for application projects
    files: ["src/**/*.ts", "projects/src-a/**/*.ts", "projects/src-b/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": ["error", {
        type: "attribute",
        prefix: "app",
        style: "camelCase",
      }],
      "@angular-eslint/component-selector": ["error", {
        type: "element",
        prefix: "app",
        style: "kebab-case",
      }],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  }
);
