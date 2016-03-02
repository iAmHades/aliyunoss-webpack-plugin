'use strict';
var fs = require('fs');
var path = require('path');

exports.eachFileSync = function(dir, callback) {
	var stats = fs.statSync(dir);
	// 遍历子目录
	if (stats.isDirectory()) {
		var files = exports.fullPath(dir, fs.readdirSync(dir));
		files.forEach(function(f) {
			exports.eachFileSync(f, callback);
		});
	} else {
		callback(dir, stats);
	}
}

exports.fullPath = function(dir, files) {
	return files.map(function(f) {
		return path.join(dir, f);
	});
}