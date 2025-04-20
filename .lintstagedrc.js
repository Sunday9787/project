module.exports = {
  '*.{js,jsx,ts,tsx,vue}': ['eslint --fix'],
  '*.{scss,css,vue}': ['stylelint --fix'],
  '*.{js,jsx,ts,tsx,vue,scss,css,md,json}': ['prettier --write']
}
