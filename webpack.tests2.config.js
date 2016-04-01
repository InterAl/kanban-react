var hostname = "localhost";
var port = 1122;

module.exports = {
  entry: {},
  output: {},
  resolve: {
    extensions: ['', '.js', '.jsx']
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
  devtool: 'cheap-module-source-map'
};
