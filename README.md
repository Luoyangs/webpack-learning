# webpack-learning

### Add package.json
```
npm i -y
```

### Install Description
```
npm i webpack webpack-cli -D
```

### Config package.json
```
"scripts": {
    "start": "webpack --config webpack.config.js"
}

// 以便确保我们安装包是私有的(private)，并且移除 main 入口。这可以防止意外发布你的代码。
remove "main": "index.js"'
"main": "index.js",
add "private": true
```

