const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.join(__dirname, 'src/main.ts'),
  externals: [ nodeExternals() ],
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        include: [ path.resolve(__dirname, 'src') ],
        test: /\.ts$/,
        use: 'ts-loader'
      },
    ],
  },
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  target: 'node'
};
