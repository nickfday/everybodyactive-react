const webpack = require("webpack");

module.exports = {
  watch: true, //
  entry: {
    index: "./src/exercises.js",
    exercises: "./src/exercises.js",
    exerciseDetail: "./src/exerciseDetail.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "[name].bundle.js"
  },
  devtool: "inline-source-map",
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: "./dist",
    hot: true
    // after: function() {
    //   "npx webpack --config webpack.config.js";
    // }
  }
};
