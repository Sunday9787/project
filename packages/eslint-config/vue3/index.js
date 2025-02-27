/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue-pug/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  plugins: ['simple-import-sort', 'import'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    vueFeatures: {
      filter: true
    },
    templateTokenizer: {
      pug: 'vue-eslint-parser-template-tokenizer-pug'
    },
    tsconfigRootDir: ['./tsconfig.json']
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-this-alias': ['error', { allowedNames: ['self', 'context'] }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
  }
}
