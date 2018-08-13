# webpack-learning

### 1.Add package.json
```
npm i -y
```

### 1.Install Description
```
npm i webpack webpack-cli -D
```

### 1.Config package.json
```
"scripts": {
    "start": "webpack --config webpack.config.js"
}

// 以便确保我们安装包是私有的(private)，并且移除 main 入口。这可以防止意外发布你的代码。
remove "main": "index.js"'
"main": "index.js",
add "private": true
```

### 1.Config dist
```
add 'index.html'
<script src="main.js"></script>
```

### 1.执行webpack
```
// 执行 npx webpack，会将我们的脚本作为入口起点，然后 输出 为 main.js。Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件
npx webpack
```

### 1.查看效果
```
浏览器打开dist下面的index.html
```

### 1.过滤掉依赖文件
```
在根目录下添加.gitignore文件

# dependencies
node_modules

# mac
.DS_Store
```

### 2.使用配置文件
在根目录下添加webpack.config.js
```
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

此处生成的bundle.js和main.js是一样的
```

### 2.添加 NPM 脚本
```
在 package.json里面script添加
"build": "webpack"

执行 npm run build 将在dist下面生成bundle.js和前面是一样的
```