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
    buildPath:'your build path',
    region: 'your region',
    accessKeyId: 'your key',
    accessKeySecret: 'your secret',
    bucket: 'your bucket',
    getObjectHeaders: function(filename) {
      return {
        Expires: 6000
      }
    }
  })]
}
```   

don't depend webpack,just as follows:
```javascript
var AliyunossWebpackPlugin = require('aliyunoss-webpack-plugin')
var oss = new AliyunossWebpackPlugin({
  buildPath:'your build path',
  region: 'your region',
  accessKeyId: 'your key',
  accessKeySecret: 'your secret',
  bucket: 'your bucket',
  deleteAll: true,
  generateObjectPath: function(filename) {
    return filename
  },
  getObjectHeaders: function(filename) {
    return {
      Expires: 6000
    }
  }
});
oss.apply()
```     

Configuration
-------------
The plugin allowed values are as follows:

- `buildPath`: 需要上传的文件路径,支持整个文件夹的遍历。支持node-glob风格路径，具体可以参见[node-glob的文档](https://github.com/isaacs/node-glob)。
- `region`: oss的区域，如:oss-cn-shanghai。
- `accessKeyId`: 阿里云的权限访问的key。
- `accessKeySecret`: 阿里云的权限访问的secret。
- `bucket`: 阿里云OSS上的命名空间。
- `deleteAll`: 先删除oss上的代码之后再上传，默认为false
- `generateObjectPath`: 函数（可选），函数参数为上传的文件名，必须返回一个字符串作为文件名，默认为文件原名。通过该函数可以让使用者自定义上传的文件名或者修改oss的路径，比如加一个前缀等
- `getObjectHeaders`: 函数（可选），函数参数为上传的文件名，返回设置的headers对象，默认为空，具体可以参见[ali-oss的文档](http://doc.oss.aliyuncs.com/#_Toc336676772)
- `internal`: 使用内网还是外网（可选），默认外网
