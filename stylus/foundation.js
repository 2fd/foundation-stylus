'use strict';


var version = require('../package.json').version;
var libPath = __dirname;
var dependencies = [require('stylus-type-utils')];

/**
 * Return the plugin callback for stylus.
 *
 * @return {Function}
 * @api public
 */
exports = module.exports = function plugin() {
  return function(stylus){
    stylus.include(libPath);
    dependencies.forEach(function(dep) {
      stylus.use(dep());
    });
  };
};

/**
 * Library version.
 */
exports.version = version;

/**
 * Stylus path.
 */
exports.path = libPath;

/**
 * Dependent modules
 * 
 * @type {Array}
 */
exports.dependencies = dependencies;
