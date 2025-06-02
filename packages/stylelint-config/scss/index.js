const path = require('node:path')

/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    path.resolve(__dirname, '../base.js'),
    'stylelint-config-recommended-vue',
    'stylelint-config-recommended-scss'
  ]
}
