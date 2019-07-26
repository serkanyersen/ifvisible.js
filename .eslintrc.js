module.exports = {
  // extends: 'airbnb-base',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript/base'],
  rules: {
    'import/no-cycle': 0,
    'no-inner-declarations': 0,
    'no-restricted-globals': 0,
    'no-undef': 0,
    'max-len': 0,
    camelcase: 0,
    'import/prefer-default-export': 0,
    // don't require .vue extension when importing
    'import/extensions': [ 'error', 'always', {
        ts: 'never',
        js: 'never',
        jsx: 'never',
    }],
    'object-curly-newline': 0,
    'arrow-body-style': 0,
    // allow function without return statement
    'consistent-return': 0,
    // enforce multiline trailing commas everywhere except function params
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    // allow require statements anywhere
    'global-require': 0,
    // allow dangling underscore
    'no-underscore-dangle': 0,
    // force space before function parentheses everywhere
    'space-before-function-paren': ['error', 'always'],
    // allow modules to use a single named export
    'import/prefer-default-export': 0,
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
      ],
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/interface-name-prefix": ["error", "always"],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: 'no-public' } ]
  },
  parserOptions: {
    project: "./tsconfig.json"
  },
};
