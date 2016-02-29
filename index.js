'use strict';
var path = require('path');
var fs = require('fs');
var oss = require('ali-oss');
var co = require('co');
var _ = require('lodash');

function AliyunossWebpackPlugin(options) {
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
		files = _this.getFiles(_this.options.buildPath);
		var j = 0;
		for (var i = 0; i < files.length; i++) {
			if (j < _this.options.queueSize) {
				var file = files[i];
				var fileName = file.split('/').pop();
				yield store.put(fileName, files[i]);
				j++;
			} else {
				j = 0;
			}
		}
	}).catch(function(err) {
		console.info(err)
	})
}

AliyunossWebpackPlugin.prototype.getFiles = function(filePath) {
	var suffix = {
		jpg: true,
		png: true,
		js: true,
		css: true,
		jpeg: true
	};
	var fileArray = [];
	var files = fs.readdirSync(filePath);
	var fss = [];
	files.forEach(function(fileName) {
		var fsplit = fileName.split('.');
		if (fsplit.length > 1) {
			if (suffix[fsplit[fsplit.length - 1]]) {
				fileArray.push(filePath + '/' + fileName);
			}
		}
	});
	return fileArray;
}

module.exports = AliyunossWebpackPlugin;