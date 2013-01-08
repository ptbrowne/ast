'use strict';

var fs = require('fs');
var codegen = require('escodegen');

/**
 * @constructor
 * @class Task
 */
function Task(name) {
  this.name = name;
}

/**
 * @method execute
 * @interface
 * @description This method should be not invoked directly
 *              It's designed to be implemented in derived class
 */
Task.prototype.execute = function() {
  return new Error("should be implemented in derived class");
};

module.exports = Task;
