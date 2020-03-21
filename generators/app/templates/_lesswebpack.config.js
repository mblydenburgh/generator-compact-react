const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "<%= main %>",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {test: /\.(js)$/, use: "babel-loader"},
      {
        test: /\.(css|less)$/, use: [
          {
            loader: "css-loader",
            options: {
              discardDuplicates: true,
              importLoaders: 1,
              // This enables local scoped CSS based in CSS Modules spec
              modules: true,
              // generates a unique name for each class (e.g. app__app___2x3cr)
              localIdentName: '[name]__[local]___[hash:base64:5]',
            }
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "style-loader"
          }
        ]
      },
      {test: /\.(jpg|png|jpeg|gif)$/, use: ["file-loader"]}
    ]
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ]
};
