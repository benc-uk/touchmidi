const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
// const WebpackAutoInject = require('webpack-auto-inject-version')

module.exports = {
  watch: true,
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist')
  },

  plugins: [new CleanWebpackPlugin()],

  module: {
    // Load CSS as raw, apparently this is what hybrids-js needs
    rules: [
      {
        test: /\.css$/,
        use: 'raw-loader'
      }
      // { test: /\.json$/, use: 'json-loader' }
    ]
  }
}
