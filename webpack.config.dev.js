const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(c|sc)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [
                require('autoprefixer')()
              ]
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  }
})