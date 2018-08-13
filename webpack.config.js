const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    // 清理dist文件夹
    new CleanWebpackPlugin(['dist']),
    // 自动将output内容注入到index.html
    new HtmlWebpackPlugin({
      title: 'Output Management',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        keywords: 'VUE; WEBPACK;WEBPACK-CLI'
      }
    })
  ]
}