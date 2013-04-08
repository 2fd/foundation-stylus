'use strict';


/**
 * Return the plugin callback for stylus.
 *
 * @return {Function}
 * @api public
 */
exports = module.exports = function plugin() {
  var libPath = this.path;
  var dependencies = this.dependencies;
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
exports.version = require('../package.json').version;

/**
 * Stylus path.
 */

exports.path = __dirname;

/**
 * Dependent modules
 * 
 * @type {Array}
 */
exports.dependencies = [require('stylus-type-utils')];
