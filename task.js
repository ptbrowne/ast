'use strict';

var fs = require('fs');
var codegen = require('escodegen');

function Task(name) {
  this.name = name;
}

Task.prototype.execute = function() {
  return new Error("should be implemented in derived class");
};

module.exports = Task;
