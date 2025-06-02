/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-html/vue', 'stylelint-config-recess-order'],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'declaration-property-value-no-unknown': null,
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx']
      }
    ],
    'selector-class-pattern': [
      '^[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      {
        resolveNestedSelectors: true,
        message: '类名必须符合 BEM 命名规范，例如 block__element--modifier'
      }
    ]
  }
}
