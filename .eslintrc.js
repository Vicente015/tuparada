/* eslint-env node */
/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'standard-with-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:astro/recommended',
    'plugin:react/recommended',
    'plugin:sort/recommended'
  ],
  plugins: ['react'],
  ignorePatterns: ['./src/', '**/dist'],
  parserOptions: {
    project: ['tsconfig.eslint.json', 'apps/client/tsconfig.json', 'apps/server/tsconfig.json'],
    tsConfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'sort/object-properties': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      rules: {
        'react/no-unknown-property': 'off'
      }
    }
  ]
}
