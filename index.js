'use strict';
var path = require('path');
var fs = require('fs');
var oss = require('ali-oss');
var co = require('co');
var _ = require('lodash');
var colors = require('colors');
var fileUtils = require('./utils/file')


function AliyunossWebpackPlugin(options) {
	this.fileArray = [];
	this.options = _.extend({
		queueSize: 10
	}, options);
}

AliyunossWebpackPlugin.prototype.apply = function(compiler) {
	var _this = this;
	compiler.plugin("done", function(compilation) {
		_this.oposs();
	});
};

AliyunossWebpackPlugin.prototype.oposs = function() {
	var _this = this;
	co(function*() {
		'use strict';
		var store = oss({
			region: _this.options.region,
			accessKeyId: _this.options.accessKeyId,
			accessKeySecret: _this.options.accessKeySecret,
			bucket: _this.options.bucket
		});
		//删除oss上代码
		var fileList = yield store.list();
		var files = [];
		if (fileList.objects) {
			fileList.objects.forEach(function(file) {
				files.push(file.name);
			})
			var result = yield store.deleteMulti(files, {
				quiet: true
			});
		}
		//上传oss的新代码
		fileUtils.eachFileSync(_this.options.buildPath, function(filename, stats) {
			_this.fileArray.push(filename);
		});
		var j = 0;
		for (var i = 0; i < _this.fileArray.length; i++) {
			var file = _this.fileArray[i];
			var fileName = file.split('/').pop();
			yield store.put(fileName, file);
			console.log(file + '-- upload success'.green);
		}
	}).catch(function(err) {
		console.info(err)
	})
}


module.exports = AliyunossWebpackPlugin;