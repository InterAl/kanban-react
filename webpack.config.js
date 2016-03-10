var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
  entry: './app/index.jsx',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: 'build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /.css$/,
        loader: 'style-loader!css-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    //new HtmlwebpackPlugin({
    //  title: 'First react app'
    //})
  ],
  devtool: 'source-map' 
};
