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
  new CleanWebpackPlugin(['dist])
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