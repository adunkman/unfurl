module.exports = {
  '*.{ts,js,jsx,json,css,scss,md,yml,yaml}': 'prettier --write',
  '*.tf': () => 'make terraform-lint', // Ignore filenames
};
