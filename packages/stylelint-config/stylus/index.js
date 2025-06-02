const path = require('node:path')

/** @type {import('stylelint').Config} */
module.exports = {
  customSyntax: 'postcss-styl',
  extends: [path.resolve(__dirname, '../base.js'), 'stylelint-stylus/standard'],
  rules: {
    'selector-class-pattern': null,
    'at-rule-no-unknown': null,
    'color-no-invalid-hex': true,
    'less/color-no-invalid-hex': true
  }
}
