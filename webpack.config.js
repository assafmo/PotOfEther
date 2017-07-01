var webpack = require('webpack');

var config = {
  entry: __dirname + '/app.jsx',
  output: {
    path: __dirname,
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: __dirname,
        loader: 'babel-loader'
      }
    ]
  }
};

module.exports = config;
