const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-source-map',

  entry: path.resolve(__dirname, 'client', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ]
    }]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devServer: {
    historyApiFallback: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Deck Creator',
      filename: path.resolve(__dirname, 'dist', 'index.html')
    }),

    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'static'),
      to: 'static'
    }])
  ]
};

