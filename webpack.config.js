const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(process.cwd(), "dist"),
  },

  plugins: [new CleanWebpackPlugin()],

  module: {
    // Load CSS as raw, apparently this is what hybrids-js needs
    rules: [{ test: /\.css$/, use: "raw-loader" }],
  },
};
