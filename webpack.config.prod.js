const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

module.exports = merge(baseConfig, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // 当文件内容发生变化时，生产文件对应的编译hash才会发生变化
    new webpack.HashedModuleIdsPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      // 这些选项帮助 ServiceWorkers 快速启用
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  optimization: {
    // 打包 公共文件
    splitChunks: {
      cacheGroups: {
        // node_modules内的依赖库 
        vendor: {
          chunks: "all", 
          test: /[\\/]node_modules[\\/]/, 
          name: "vendor", 
          minChunks: 1, //被不同entry引用次数(import),1次的话没必要提取 
          maxInitialRequests: 5, 
          minSize: 0, 
          priority: 100, 
        },
        // ‘src/util’ 下的js文件 
        common: {
          chunks: "all", 
          test: /[\\/]src[\\/]util[\\/]/,//也可以值文件/[\\/]src[\\/]js[\\/].*\.js/, 
          name: "common", //生成文件名，依据output规则 
          minChunks: 2, 
          maxInitialRequests: 5, 
          minSize: 0, 
          priority: 1 
        }
      }
    },
    // 用来提取 entry chunk 中的 runtime部分函数，形成一个单独的文件，这部分文件不经常变换，方便做缓存。
    // runtimeChunk: {
    //   name: 'manifest'
    // }
  }
})