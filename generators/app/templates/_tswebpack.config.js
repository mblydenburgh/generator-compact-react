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
      { test: /\.(js)$/, use: "babel-loader" },
      { test: /\.(css)$/, use: ["css-loader", "style-loader"] },
      { test: /\.(jpg|png|jpeg|gif)$/, use: ["file-loader"] },
      { "test": /\.(tsx)?$/, "use": ["awesome-typescript-loader"] }
    ]
},
mode: 'development',
  plugins: [
  new HtmlWebpackPlugin({
    template: 'app/index.html'
  })
]
};
