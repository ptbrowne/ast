'use strict';

var Task = require('../task');

var task = new Task('remove-console-in-production');

task.execute = function() {
  this.escodegen.traverse(this.ast, {
    cursor: 0,
    enter: function(node) {
      var data;

      if ('ExpressionStatement' === node.type &&
          'CallExpression' === node.expression.type &&
          'console' === node.expression.callee.object.name) {

        // should remove console node instead of setting EmptyStatement
        node.type = 'EmptyStatement';
      }
    }
  });
};

module.exports = task;
