'use strict';
var fs = require('fs');
var path = require('path');
var glob = require("glob");

exports.eachFileSync = function(dir, callback) {
	glob.sync(dir,{nodir:true}).map(function(el){
		callback(el);
	});
}

