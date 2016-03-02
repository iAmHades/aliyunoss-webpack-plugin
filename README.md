##aliyunoss-webpack-plugin
webpack的插件，用于自动上传静态资源到阿里的oss上，以便作为静态资源使用，当然你也可以用于自动存储大文件。  

Installation
------------
Install the plugin with npm:
```shell
$ npm install aliyunoss-webpack-plugin --save-dev
```

Basic Usage
-----------

add the plugin to your webpack config as follows:

```javascript
var AliyunossWebpackPlugin = require('aliyunoss-webpack-plugin')
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'index_bundle.js'
  },
  plugins: [new AliyunossWebpackPlugin({
    buildPath:__dirname+'/build',
    region: 'your region',
    accessKeyId: 'your key',
    accessKeySecret: 'your secret',
    bucket: 'your bucket'
  })]
}
```

Configuration
-------------
The plugin allowed values are as follows:

- `buildPath`: 需要上传的文件路径,支持整个文件夹的遍历。 
- `region`: oss的区域，如:oss-cn-shanghai。
- `accessKeyId`: 阿里云的权限访问的key。
- `accessKeySecret`: 阿里云的权限访问的secret。
- `bucket`: 阿里云的权限访问的secret。