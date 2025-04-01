/** @type {import('stylelint').Config} */
module.exports = {
  customSyntax: 'postcss-styl',
  extends: ['../base.js', 'stylelint-stylus/standard'],
  rules: {
    'selector-class-pattern': null,
    'at-rule-no-unknown': null,
    'color-no-invalid-hex': true,
    'less/color-no-invalid-hex': true
  }
}
