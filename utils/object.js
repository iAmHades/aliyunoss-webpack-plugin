'use strict';
var array = []
exports.extend = function (target) {
    var args = array.slice.call(arguments, 1);
    args.forEach(function (arg) {
        merge(target, arg);
    });
    return target;
};

exports.merge = function (target) {
    var args = array.slice.call(arguments, 1);
    args.forEach(function (arg) {
        merge(target, arg, true);
    });
    return target;
};

exports.isPlainObject = function (obj) {
    return exports.isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
};

exports.isString = function (val) {
    return typeof val === 'string';
};

exports.isFunction = function (val) {
    return typeof val === 'function';
};

exports.isObject = function (obj) {
    return obj !== null && typeof obj === 'object';
};

exports.isArray = Array.isArray;

function merge(target, source, deep) {
    for (var key in source) {
        if (deep && (exports.isPlainObject(source[key]) || exports.isArray(source[key]))) {
            if (exports.isPlainObject(source[key]) && !exports.isPlainObject(target[key])) {
                target[key] = {};
            }
            if (exports.isArray(source[key]) && !exports.isArray(target[key])) {
                target[key] = [];
            }
            merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}
