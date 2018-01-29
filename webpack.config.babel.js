import path from 'path';

export default {
  entry: {
    client: path.resolve(__dirname, 'client', 'index.js'),
    server: path.resolve(__dirname, 'server', 'index.js')
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },

  module: {
    rules: [{
      test: /\.js$/,
      include: /server/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['babel-preset-env']
        }
      }
    }]
  }
};

