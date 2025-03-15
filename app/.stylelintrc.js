module.exports = {
  ignoreFiles: ["**/*.scss"],
  extends: [
    'stylelint-config-idiomatic-order',
    'stylelint-config-standard-vue/scss',
    'stylelint-config-prettier-scss',
  ],
  rules: {
    'no-duplicate-selectors': null,
    'no-empty-source': null,
    'no-descending-specificity': null,
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
  },
}
