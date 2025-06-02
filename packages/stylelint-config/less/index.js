const path = require('node:path')

/** @type {import('stylelint').Config} */
module.exports = {
  extends: [path.resolve(__dirname, '../base.js'), 'stylelint-config-standard-less'],
  plugins: ['stylelint-less'],
  rules: {
    'selector-class-pattern': null,
    'at-rule-no-unknown': null,
    'color-no-invalid-hex': true,
    'less/color-no-invalid-hex': true
  }
}
