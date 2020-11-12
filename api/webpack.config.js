const path = require('path');

module.exports = {
  entry: {
    'run-in-lambda': './run-in-lambda.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
  },

  mode: 'production',
  devtool: 'inline-source-map',

  target: 'node12',
  externalsPresets: { node: true },

  externals: {
    bufferutil: 'bufferutil', // ws optional module
    'utf-8-validate': 'utf-8-validate', // ws optional module
    canvas: 'util', // jsdom optional module
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: 'babel-loader',
      },
    ],
  },
};
