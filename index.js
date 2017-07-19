'use strict';
var path = require('path');
var fs = require('fs');
var oss = require('ali-oss');
var co = require('co');
var colors = require('colors');
var fileUtils = require('./utils/file')
var _ = require('./utils/object')


function AliyunossWebpackPlugin(options) {
	if (!options || !options.buildPath || !options.region || !options.accessKeyId || !options.accessKeySecret || !options.bucket) {
		console.info('Some parameters of the problem，please set as the follow:')
		console.info(" new".red + " AliyunossWebpackPlugin({");
		console.info("   buildPath:'your path',".yellow);
		console.info("   region: 'your region',".yellow);
		console.info("   accessKeyId: 'your accessKeyId',".yellow);
		console.info("   accessKeySecret: 'your accessKeySecret',".yellow);
		console.info("   bucket: 'your bucket'".yellow);
		console.info(" })");
		throw new Error('Some parameters of the problem')
	}
	this.fileArray = [];
	this.options = _.extend({

	}, options);
}

AliyunossWebpackPlugin.prototype.apply = function(compiler) {
	var _this = this;
	if (compiler) {
		compiler.plugin("done", function(compilation) {
			_this.oposs();
		});
	} else {
		_this.oposs();
	}
};

AliyunossWebpackPlugin.prototype.oposs = function() {
	var _this = this;
	var deleteAll = _this.options.deleteAll || false;
	var generateObjectPath = _this.options.generateObjectPath || function(fileName) {
		return fileName;
	}
	var getObjectHeaders = _this.options.getObjectHeaders || function() {
		return {};
	}

	co(function*() {
		'use strict';
		var store = oss({
			region: _this.options.region,
			accessKeyId: _this.options.accessKeyId,
			accessKeySecret: _this.options.accessKeySecret,
			bucket: _this.options.bucket,
			internal: _this.options.internal ? true : false,
		});

		//删除oss上代码
		if (deleteAll) {
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
		}

		//上传oss的新代码
		fileUtils.eachFileSync(_this.options.buildPath, function(filename, stats) {
			_this.fileArray.push(filename);
		});

		var j = 0;
		for (var i = 0; i < _this.fileArray.length; i++) {
			var file = _this.fileArray[i];
			var fileName = file.split('/').pop();
			var ossFileName = generateObjectPath(fileName, file);
			if (ossFileName) {
				yield store.put(ossFileName, file, {
					timeout: _this.options.timeout,
					headers: getObjectHeaders(fileName)
				});
				console.log(file + ' -- upload to ' + ossFileName + ' success'.green);
			} else {
				console.log('skipping file ' + file)
			}
		}
	}).catch(function(err) {
		console.info(err)
	})
}


module.exports = AliyunossWebpackPlugin;
