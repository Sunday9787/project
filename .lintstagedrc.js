module.exports = {
  '*.{ts,tsx,vue}': ['eslint --fix'],
  '*.{scss,css,vue}': ['stylelint --fix'],
  '*.{md,json}': ['prettier --write']
}
