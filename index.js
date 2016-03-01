'use strict';
var path = require('path');
var fs = require('fs');
var oss = require('ali-oss');
var co = require('co');
var _ = require('lodash');
var rd = require('rd');
var colors = require('colors');


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
		_this.getFiles(_this.options.buildPath);
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

AliyunossWebpackPlugin.prototype.getFiles = function(filePath) {
	var _this = this;
	var suffix = {
		jpg: true,
		png: true,
		js: true,
		css: true,
		jpeg: true
	};
	var files = fs.readdirSync(filePath);
	var fss = [];
	var files = rd.readSync(filePath);
	files.forEach(function(filePath) {
		var f = fs.statSync(filePath);
		if (!f.isDirectory()) {
			var fsplit = filePath.split('.');
			if (fsplit.length > 1) {
				if (suffix[fsplit.pop()]) {
					_this.fileArray.push(filePath);
				}
			}
		}
	});
}

module.exports = AliyunossWebpackPlugin;