module.exports = {
  "*.{ts,js,jsx,json,css,scss,md,yml,yaml}": "prettier --write",
  "*.tf": () => "npm run lint:tflint", // Ignore filenames
};
