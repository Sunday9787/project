/** @type {import('stylelint').Config} */
module.exports = {
  customSyntax: 'postcss-less',
  extends: ['../base.js', 'stylelint-config-standard-less'],
  plugins: ['stylelint-less'],
  rules: {
    'selector-class-pattern': null,
    'at-rule-no-unknown': null,
    'color-no-invalid-hex': true,
    'less/color-no-invalid-hex': true
  }
}
