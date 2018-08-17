const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/poll?1000',
    path.join(__dirname, 'src/main.ts')
  ],
  externals: [
    nodeExternals({
      whitelist: [ 'webpack/hot/poll?1000' ]
    })
  ],
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        exclude: [ path.resolve(__dirname, 'node_modules') ],
        test: /\.ts$/,
        use: 'ts-loader'
      },
    ],
  },
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin([ 'dist' ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  target: 'node'
};
