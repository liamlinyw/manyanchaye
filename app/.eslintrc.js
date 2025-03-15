require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  globals: {
    uniCloud: 'readonly',
  },
  extends: ['plugin:vue/vue3-essential', '@vue/standard-with-typescript', '@vue/eslint-config-prettier'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 1,
    'simple-import-sort/exports': 1,
    'prefer-promise-reject-errors': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/prefer-nullish-coalescing': 0,
    '@typescript-eslint/no-misused-promises': 0,
    'vue/multi-word-component-names': 0,
  },
}
