var hostname = "localhost";
var port = 1122;

module.exports = {
  entry: 'mocha!./test/board.test.js',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    filename: 'test.build.js',
    path: 'tests/',
    publicPath: 'http://' + hostname + ':' + port + '/tests'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'react-hot!babel-loader',
        exclude: /node_modules/
      },
      {
        test: /(\.css|\.less)$/,
        loader: 'css-loader',
        exclude: [
          /build/,
          /node_modules/
        ]
      },
      {
        test: /(\.jpg|\.jpeg|\.png|\.gif)$/,
        loader: 'null-loader'
      }
    ]
  },
  devServer: {
    host: hostname,
    port: port
  },
  devtool: 'source-map'
};
