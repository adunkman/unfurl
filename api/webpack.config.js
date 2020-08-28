const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './run-in-lambda.js',
  mode: 'production',
  target: 'node',
  output: {
    filename: 'lambda.js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new webpack.IgnorePlugin(/(canvas|utf-8-validate|bufferutil)/)
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: { node: true }
              }]
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }
    ]
  }
};
