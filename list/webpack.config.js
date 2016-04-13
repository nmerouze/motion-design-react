const path = require('path')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './src/index',
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.resolve(__dirname, 'src'),
    }],
  }
}
