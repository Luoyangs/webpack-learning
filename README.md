# webpack-learning

## 1.安装
### 1.Add package.json
```
npm i -y
```

### 2.Install Description
```
npm i webpack webpack-cli -D
```

### 3.Config package.json
```json
"scripts": {
    "start": "webpack --config webpack.config.js"
}

// 以便确保我们安装包是私有的(private)，并且移除 main 入口。这可以防止意外发布你的代码。
remove "main": "index.js"'
"main": "index.js",
add "private": true
```

### 4.Config dist
add 'index.html'
```HTML
<script src="main.js"></script>
```

### 5.执行webpack
```
// 执行 npx webpack，会将我们的脚本作为入口起点，然后 输出 为 main.js。Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件
npx webpack
```

### 6.查看效果
```
浏览器打开dist下面的index.html
```

### 7.过滤掉依赖文件
```
在根目录下添加.gitignore文件

# dependencies
node_modules

# mac
.DS_Store
```

## 2.起步
### 1.使用配置文件
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

### 2.执行webpack
```
npx webpack --config webpack.config.js
```
此处生成的bundle.js和main.js是一样的

### 3.添加 NPM 脚本
在 package.json里面script添加
```json
"build": "webpack"
```
执行 npm run build 将在dist下面生成bundle.js和前面是一样的

### 4.浏览器查看
将dist/index.html里面的script内容改成bundle.js

## 3.管理资源
### 1.加载CSS
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

### 2.加载图片
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

### 3.添加字体
利用file-loader
```js
+  {
+     test: /\.(woff|woff2|eot|ttf|otf)$/,
+     use: ['file-loader']
+  }
```

### 4.添加其他类型的文件
可以利用scv-loader、xml-loader等等加载器

### 5.查看效果
```
npm run build
```