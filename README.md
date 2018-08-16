# webpack-learning

## 1.安装
### 1.1 Add package.json
```
npm i -y
```

### 1.2 Install Description
```
npm i webpack webpack-cli -D
```

### 1.3 Config package.json
```json
"scripts": {
    "start": "webpack --config webpack.config.js"
}

// 以便确保我们安装包是私有的(private)，并且移除 main 入口。这可以防止意外发布你的代码。
remove "main": "index.js"'
"main": "index.js",
add "private": true
```

### 1.4 Config dist
add 'index.html'
```HTML
<script src="main.js"></script>
```

### 1.5 执行webpack
```
// 执行 npx webpack，会将我们的脚本作为入口起点，然后 输出 为 main.js。Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件
npx webpack
```

### 1.6 查看效果
```
浏览器打开dist下面的index.html
```

### 1.7 过滤掉依赖文件
```
在根目录下添加.gitignore文件

# dependencies
node_modules

# mac
.DS_Store
```

## 2.起步
### 2.1 使用配置文件
在根目录下添加webpack.config.js
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

```

### 2.2 执行webpack
```
npx webpack --config webpack.config.js
```
此处生成的bundle.js和main.js是一样的

### 2.3 添加 NPM 脚本
在 package.json里面script添加
```json
"build": "webpack"
```
执行 npm run build 将在dist下面生成bundle.js和前面是一样的

### 2.4 浏览器查看
将dist/index.html里面的script内容改成bundle.js

## 3.管理资源
### 3.1 加载CSS
安装依赖
```
npm i style-loader css-loader -D
```

配置webpack.config.js
```js
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: ['style-loader', 'css-loader']
+       }
+     ]
+   }
```

测试css: 在src下面添加一个style.css文件
```css
.hello{
  color: red;
}
```

在src/index.js里面引入css
```js
import './style.css'

...
ele.classList.add('.hello')
...
```

### 3.2 加载图片
此处将利用file-loader
```
npm i file-loader -D
```

配置webpack.config.js:在module下面添加新的rule
```js
{
  test: /\.(png|svg|jpg|jpeg|gif)$/,
  use: ['file-loader']
}
```

在src里面添加一张图片，并在index.js里面引用
```js
import icon from './icon.png'

// 创建一个图片，并将它插入到现有的div中
let image = new Image()
image.src = icon

ele.appendChild(image)
```

在css中引入图片
```css
.hello{
  color: red;
  background: url('./icon.png') no-repeat;
}
```

### 3.3 添加字体
利用file-loader
```js
+  {
+     test: /\.(woff|woff2|eot|ttf|otf)$/,
+     use: ['file-loader']
+  }
```

### 3.4 添加其他类型的文件
可以利用scv-loader、xml-loader等等加载器

### 3.5 查看效果
```
npm run build
```

## 4.管理输出
到目前为止，我们在 index.html 文件中手动引入所有资源，然而随着应用程序增长，并且一旦开始对文件名使用哈希(hash)]并输出多个 bundle，手动地对 index.html 文件进行管理，一切就会变得困难起来。然而，可以通过一些插件，会使这个过程更容易操控。

### 4.1 预先准备
在src下面添加一个print.js
```js
export default function printMe() {
  console.log('I get called from print.js')
}
```

在index.js里面引入
```js
import printMe from './print'

...
let btn = document.createElement('button')
btn.innerHTML = 'Click it And Print'
btn.addEventListener('click', printMe)
ele.appendChild(btn)
...
```

在webpack.config.js里面配entry和output
```js
entry: {
  app: './src/index.js',
  print: './src/print.js'
},
output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist')
}
```

在dist/index.html里面修改script标签
```HTML
<script src="print.bundle.js"></script>
<script src="app.bundle.js"></script>
```

### 4.2 查看效果
```
npm run build
```
可以看到dist下面生成了app.bundle.js和print.bundle.js两个文件，用浏览器打开dist/index.html，可以看到最终效果

### 4.3 设定HtmlWebpackPlugin
安装依赖包
```
npm i html-webpack-plugin -D
```

在package.config.js里面配置plugins
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
...
plugins [
  new HtmlWebpackPlugin({
    title: 'Output Management'
  })
]
```

### 4.4 清理dist文件夹
安装依赖包
```
npm i clean-webpack-plugin -D
```

在package.config.js里面配置plugins
```js
const CleanWebpackPlugin = require('clean-webpack-plugin')
...
plugins [
  new CleanWebpackPlugin(['dist'])
]
```

### 4.5 Manifest
TODO: this is a todo part

## 5.开发环境配置
### 5.1 使用source map(仅限于开发环境)
直接在webpack.config.js里面配置
```js
devtool: 'inline-source-map'
```

测试是否有效果,修改print.js
```js
export default function printMe() {
  console.error('I get called from print.js')
}
```

执行编译
```
npm run build
```

### 5.2 选择一个开发工具
每次要编译代码时，手动运行 npm run build 就会变得很麻烦

- webpack's watch mode
- webpack-dev-server
- webpack-dev-middleware

#### 5.2.1 webpack's watch mode
你可以指示 webpack "watch" 依赖所有文件以进行更改。如果其中一个文件被更新，代码将被重新编译，所以你不必手动运行整个构建。在package.json script里面添加一个脚本
```json
"watch": "webpack --watch"
```
唯一的缺点是，为了看到修改后的实际效果，你需要刷新浏览器。如果能够自动刷新浏览器就更好了，可以尝试使用 webpack-dev-server，恰好可以实现我们想要的功能。

#### 5.2.2 webpack-dev-server
webpack-dev-server提供了一个简单的web服务器，并且能够实时重新加载。需要安装依赖包
```
npm i webpack-dev-server -D
```
修改配置文件webpack.config.js，告诉开发服务器(dev server)，在哪里查找文件：
```js
devServer: {
  contentBase: './dist'
}
```
以上配置告知 webpack-dev-server，在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问文件。

在package.json添加一个script脚本
```json
"start": "webpack-dev-server --open"
```

#### 5.2.3 webpack-dev-middleware
webpack-dev-middleware是一个容器，它可以将webpack处理后的文件传递给一个服务器（server）。webpack-dev-server在内部使用了它，同时，它作为一个单独的包来使用，以便进行更多的自定义设置来实现更多的需求。接下来是一个webpack-dev-middleware配合express server的事例。

首先安装依赖包
```
npm i express webpack-dev-middleware -D
```
接下来我们需要修改一下webpack.config.js的output
```js
output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/'
}
```
publicPath 也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问，我们稍后再设置端口号。下一步就是设置我们自定义的 express 服务：

在根目录下新建一个server.js文件
```js
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config')
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.listen(3000, function () {
  console.log('Example run at http://localhost:3000...')
})
```

在package.json里面添加一个脚本
```
"server": "node server.js"
```

查看效果
```
npm run server
```
打开浏览器，跳转到 http://localhost:3000，你应该看到你的webpack 应用程序已经运行！

## 6. 模块热替换
模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。本页面重点介绍实现，而[概念页面](https://www.webpackjs.com/concepts/hot-module-replacement/)提供了更多关于它的工作原理以及为什么它有用的细节。

HMR 不适用于生产环境，这意味着它应当只在开发环境使用
### 6.1 启用HRM
在webpack.config.js里面引入webpack,并修改entry、devServer、plugins
```js
const webpack = require('webpack')

...
entry: {
  app: './src/index.js'
},
devServer: {
  contentBase: './dist',
  hot: true
},
plugins: [
  ...
  new webpack.NamedModulesPlugin(), // 以便更容易查看要修补的依赖
  new webpack.HotModuleReplacementPlugin()
]
```
修改src/index.js
```js
...
if (module.hot) {
  module.hot.accept('./print.js', () => {
    console.log('Accepting the updated printMe modules')
    printMe()
  })
}
```

## 7. Tree Shaking
tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

在src下面创建一个math.js文件，定义两个方法并export出来
```js
export function square(x) {
  return x * x
}

export function cube(x) {
  return x * x * x
}
```
然后在index.js里面引入cube方法，（square就属于未引用代码，也就是说应该删掉未被引用的export）
```js
import _ from 'lodash';
import { cube } from './math.js';

  function component() {
  var element = document.createElement('div');
  var element = document.createElement('pre');

  // lodash 是由当前 script 脚本 import 导入进来的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.innerHTML = [
    'Hello webpack!',
    '5 cubed is equal to ' + cube(5)
  ].join('\n\n');

    return element;
  }

  document.body.appendChild(component());
```
注意，我们并未从 src/math.js 模块中 import 导入 square 方法。这个功能是所谓的“未引用代码(dead code)”，也就是说，应该删除掉未被引用的 export。现在让我们运行我们的npm 脚本 npm run build，并检查输出的 bundle：

### 7.1 将文件标记为无副作用(side-effect-free)
在一个纯粹的 ESM 模块世界中，识别出哪些文件有副作用很简单。然而，我们的项目无法达到这种纯度，所以，此时有必要向 webpack 的 compiler 提供提示哪些代码是“纯粹部分”.在package.json里面配置
```json
{
  "name": "your-project",
  "sideEffects": false
}
```
如果你的代码确实有一些副作用，那么可以改为提供一个数组：
```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/math.js"
  ]
}
```
注意，任何导入的文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并导入 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
```
{
  "name": "your-project",
  "sideEffects": [
    "./src/math.js",
    "*.css"
  ]
}
```

### 7.2 压缩输出
通过如上方式，我们已经可以通过 import 和 export 语法，找出那些需要删除的“未使用代码(dead code)”，然而，我们不只是要找出，还需要在 bundle 中删除它们。为此，我们将使用 -p(production) 这个 webpack 编译标记，来启用 uglifyjs 压缩插件。

> --optimize-minimize 标记也会在 webpack 内部调用 UglifyJsPlugin

在webpack.config.js中配置
```
mode: "production"
```

## 8. 生产环境构建
开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。

### 8.1 配置分离
利用webpack-merge进行配置分离
```
npm i webpack-merge -D
```

新建webpack.config.base.js、webpack.config.dev.js、webpack.config.prod.js三个单独的文件

其中webpack.config.base.js里面的配置如下
```js
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist')
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
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Base Title'
    })
  ]
}
```

其中webpack.config.dev.js里面的配置如下
```js
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
})
```

其中webpack.config.prod.js里面的配置如下
```js
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
})
```

修改NPM scripts
```json
"start": "webpack-dev-server --mode=development --open --config webpack.config.dev.js", // 针对开发环境的
"build": "webpack --mode=production --config webpack.config.prod.js", // 针对生产环境
```

避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。

### 8.2 指定环境
许多library将通过与process.env.NODE_ENV环境变量关联，已决定library中应该引用哪些内容。例如，当不处于生产环境时，某些library为了使调试变得容易，可能会添加额外的日志记录和测试。其实当process.env.NODE_ENV === 'production'时，一些library将对某些代码进行优化，从而删除或者添加一些重要代码，我们可以使用webpack内置DefinePlugin为所有的依赖定义这个变量

在webpack.config.prod.js里面添加
```js 
const webpack = require('webpack')
...
plugins: [
  ...
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
]
```
技术上讲，NODE_ENV 是一个由 Node.js 暴露给执行脚本的系统环境变量。通常用于决定在开发环境与生产环境(dev-vs-prod)下，服务器工具、构建脚本和客户端 library 的行为。然而，与预期不同的是，无法在构建脚本 webpack.config.js 中，将 process.env.NODE_ENV 设置为 "production"，请查看 #2537。因此，例如 process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js' 这样的条件语句，在 webpack 配置文件中，无法按照预期运行。

在src/index.js里面添加
```js
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!')
}
```

## 9. 代码分离
有三种常用的代码分离方法：

- 入口起点：使用 entry 配置手动地分离代码。
- 防止重复：使用 CommonsChunkPlugin 去重和分离 chunk。
- 动态导入：通过模块的内联函数调用来分离代码。

### 9.1 入口起点方式
这是迄今为止最简单、最直观的分离代码的方式。不过，这种方式手动配置较多，并有一些陷阱，我们将会解决这些问题。先来看看如何从 main bundle 中分离另一个模块

在src下创建一个js文件
```js
// another-module.js
import _ from 'lodash'

console.log(_.join(['Another', 'module'], '--'))
```

在webpack.config.base.js里面添加entry
```js
another: './src/another-module.js'
```
正如前面提到的，这种方法存在一些问题:
- 如果入口 chunks 之间包含重复的模块，那些重复模块都会被引入到各个 bundle 中。
- 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码。

以上两点中，第一点对我们的示例来说无疑是个问题，因为之前我们在 ./src/index.js 中也引入过 lodash，这样就在两个 bundle 中造成重复引用。接着，我们通过使用 CommonsChunkPlugin 来移除重复的模块。

#### 9.1.1 防止重复(prevent duplication)
CommonsChunkPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。让我们使用这个插件，将之前的示例中重复的 lodash 模块去除：

> CommonsChunkPlugin 已弃用，使用optimization.splitChunks代替.提取被重复引入的文件，单独生成一个或多个文件，这样避免在多入口重复打包文件
配置项
- 1 . cacheGroups 自定义配置主要使用它来决定生成的文件
  - test 限制范围，可以是正则，匹配文件夹或文件
  - name 生成文件名
  - priority 优先级，多个分组冲突时决定把代码放在哪块
    其他参见下面
- 2 . minSize 最小尺寸必须大于此值，默认30000B
- 3 . minChunks 其他entry引用次数大于此值，默认1;个人理解minChunks指的是被不同entry引入的次数;为1时，适合分离 node_moudles 里的第三方库
- 4 . maxInitialRequests entry文件请求的chunks不应该超过此值（请求过多，耗时）
- 5 . maxAsyncRequests 异步请求的chunks不应该超过此值
- 6 . automaticNameDelimiter 自动命名连接符
- 7 . chunks 值为"initial", "async"（默认） 或 "all"
> 不配置时再production模式下开启async

production 时默认配置：
```js
optimization: { 
  splitChunks: { 
    chunks: "async", 
    minSize: 30000, 
    minChunks: 1, 
    maxAsyncRequests: 5, 
    maxInitialRequests: 3, 
    automaticNameDelimiter: '~', 
    name: true, 
    cacheGroups: { 
      vendors: { 
        test: /[\\/]node_modules[\\/]/, 
        priority: -10 
      }, 
      //cacheGroups重写继承配置，设为false不继承 
      default: {
        minChunks: 2,
        priority: -20, 
        reuseExistingChunk: true 
      }
    } 
  } 
}
```
自定义配置,请在production模式下配置。参考[webpack4入门5——插件](https://www.jianshu.com/p/3066d96aec8b)
```js
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
  runtimeChunk: {
    name: 'manifest'
  }
}
```

## 10. 懒加载
懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

我们在代码分离中的例子基础上，进一步做些调整来说明这个概念。那里的代码确实会在脚本运行的时候产生一个分离的代码块 lodash.bundle.js ，在技术概念上“懒加载”它。问题是加载这个包并不需要用户的交互 -- 意思是每次加载页面的时候都会请求它。这样做并没有对我们有很多帮助，还会对性能产生负面影响。

我们试试不同的做法。我们增加一个交互，当用户点击按钮的时候用 console 打印一些文字。但是会等到第一次交互的时候再加载那个代码块（print.js）

在src/index.js里面配置
```js
btn.addEventListener('click', () => import(/* webpackChunkName: "print" */'./print').then(module => {
  module.default()
}))
```
注意当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，因为它才是 promise 被处理后返回的实际的 module 对象。 

## 11. 缓存
### 11.1 输出文件的文件名
通过使用 output.filename 进行文件名替换，可以确保浏览器获取到修改后的文件。[hash] 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，但是更好的方式是使用 [chunkhash] 替换，在文件名中包含一个 chunk 相关(chunk-specific)的哈希。

在webpack.config.base.js中配置entry
```js
filename: '[name].[chunkhash].js'
```

### 11.2 提取模板(Extracting Boilerplate)
在webpack.config.prod.js里面配置optimization.runtimeChunk
```js
// 用来提取 entry chunk 中的 runtime部分函数，形成一个单独的文件，这部分文件不经常变换，方便做缓存。
runtimeChunk: {
  name: 'manifest'
}
```

将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用客户端的长效缓存机制，可以通过命中缓存来消除请求，并减少向服务器获取资源，同时还能保证客户端代码和服务器端代码版本一致。这可以通过使用新的 entry(入口) 起点，以及再额外配置一个 CommonsChunkPlugin 实例的组合方式来实现：

在webpack.config.base.js里面配置entry
```js
entry: {
  main: './src/index.js',
  vendor: [
    'lodash'
  ]
}
```

当文件内容发生变化时，生产文件对应的编译hash才会发生变化，在webpack.config.prod.js里面配置plugins
```js
new webpack.HashedModuleIdsPlugin()
```

## 12. 渐进式网络应用程序
渐进式网络应用程序(Progressive Web Application - PWA)，是一种可以提供类似于原生应用程序(native app)体验的网络应用程序(web app)。PWA 可以用来做很多事。其中最重要的是，在离线(offline)时应用程序能够继续运行功能。这是通过使用名为 Service Workers 的网络技术来实现的。

### 12.1 现在我们并没有离线环境下运行过
到目前为止，我们一直是直接查看本地文件系统的输出结果。通常情况下，真正的用户是通过网络访问网络应用程序；用户的浏览器会与一个提供所需资源（例如，.html, .js 和 .css 文件）的服务器通讯。

那么让我们来使用一个简易服务器，搭建出我们所需的离线体验。我们将使用 http-server package 包：
```
npm install http-server -D
```
还要修改 package.json 的 scripts 部分，来添加一个 start 脚本：
```json
"start": "http-server dist"
```
如果你之前没有操作过，请运行命令 npm run build 来构建你的项目。然后运行命令 npm start。

如果你打开浏览器访问 http://localhost:8080 (即 http://127.0.0.1)，你应该会看到在 dist 目录创建出服务，并可以访问 webpack 应用程序。如果停止服务器然后刷新，则 webpack 应用程序不再可访问。

这就是我们最终要改变的现状。在本章结束时，我们应该要实现的是，停止服务器然后刷新，仍然可以查看应用程序正常运行。

### 12.2 添加Workbox
添加 workbox-webpack-plugin 插件
```
npm i workbox-webpack-plugin -D
```
并调整 webpack.config.prod.js 文件：
```js
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

...
plugins: [
  ...
  new WorkboxWebpackPlugin.GenerateSW({
    // 这里的选项帮助serverWorker快速启动
    // 不允许遗留任何旧的serviceWorker
    clientsClaim: true,
    skipWaiting: true
  })
]
```
有了 Workbox，我们再看下执行 npm run build。现在你可以看到，生成了 2 个额外的文件：sw.js 和体积很大的 precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js。sw.js 是 Service Worker 文件，precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js 是 sw.js 引用的文件，所以它也可以运行。可能在你本地生成的文件会有所不同；但是你那里应该会有一个 sw.js 文件。

### 12.3 注册我们的serviceWorker
在src/index.js里面
```js
...
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registion => {
      console.log('SW registed:', registion)
    }).catch(err => {
      console.log('SW registion failed:', err)
    })
  })
}
```
再次运行 npm build build 来构建包含注册代码版本的应用程序。然后用 npm start 启动服务。访问 http://localhost:8080 并查看 console 控制台。

现在来进行测试。停止服务器并刷新页面。如果浏览器能够支持 Service Worker，你应该可以看到你的应用程序还在正常运行。然而，服务器已经停止了服务，此刻是 Service Worker 在提供服务。

> 友情提示： 需要屏蔽optimization.runtimeChunk配置，否则无法生效

## 13. Typescript
TypeScript 是 JavaScript 的超集，为其增加了类型系统，可以编译为普通的 JavaScript 代码。这篇指南里我们将会学习 webpack 是如何跟 TypeScript 进行集成。

### 13.1 基础安装
安装编译器和loader
```
npm install --save-dev typescript ts-loader
```

安装ts配置文件tsconfig.json
```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "sourceMap": true
  }
}
```
配置webpack.config.js
```js
rules: [
  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/
  }
]
...
resolve: {
  extensions: ['ts', 'tsx', '.js']
}
```

### 13.2 使用第三方库
当从 npm 安装第三方库时，一定要牢记同时安装这个库的类型声明文件。你可以从 TypeSearch 中找到并安装这些第三方库的类型声明文件。

举个例子，如果想安装 lodash 这个库的类型声明文件，我们可以运行下面的命令：
```
npm install --save-dev @types/lodash
```

### 13.3 导入其他资源
要在 TypeScript 里使用非代码资源，我们需要告诉 TypeScript 如何兼容这些导入类型。那么首先，我们需要在项目里创建 custom.d.ts 文件，这个文件用来编写自定义的类型声明。让我们将 .svg 文件进行声明设置：
```ts
declare module "*.svg" {
  const content: any;
  export default content;
}
```
这里，我们通过指定任何以 .svg 结尾的导入，并将模块的 content 定义为 any，将 SVG 声明一个新的模块。我们可以通过将类型定义为字符串，来更加显式地将它声明为一个 url。同样的理念适用于其他资源，包括 CSS, SCSS, JSON 等。

## 14. [bug]webpack-dev-server 在改变css的时候不能同步刷新浏览器
问题描述：

使用webpack-dev-server做webpack的HotModuleReplacementPlugin，不能设置extract-text-webpack-plugin(webpack 3以下，webpack4是用mini-css-extract-plugin替代)，只能在生成环境使用

开发环境webpack.config.dev.js配置如下：
```js
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
}
```
生产环境webpack.config.prod.js配置如下：
```js
const CleanWebpackPlugin = require('clean-webpack-plugin')
const posix = (filename) => path.posix.join('static', filename)

...
output: {
  path: path.join(__dirname, '../dist'),
  filename: posix('js/[name].[chunkhash].js'),
  chunkFilename: posix('js/[id].[chunkhash].js')
},
module: {
  rules: [
    {
      test: /\.(c|sc)ss$/,
      use: [
        MiniCssExtractPlugin.loader, // replace ExtractTextPlugin.extract({..})
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
}
...
plugins: [
  ...
  new MiniCssExtractPlugin({
    filename: posix('css/[name].[contenthash].css'),
    chunkFilename: posix('css/[id].[contenthash].css')
  }),
  // 清空dist目录，并删除该目录
  new CleanWebpackPlugin(['dist']),
]
```
