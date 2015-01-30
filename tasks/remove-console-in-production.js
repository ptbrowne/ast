'use strict';

var Task = require('../task');

var task = new Task('remove-console-in-production');

var estraverse = require('estraverse');

task.execute = function() {
  estraverse.replace(this.ast, {
    cursor: 0,
    enter: function(node) {
      if ('ExpressionStatement' === node.type &&
          'CallExpression' === node.expression.type &&
          node.expression.callee.object &&
          'console' === node.expression.callee.object.name) {
        return estraverse.VisitorOption.Remove;
      }
    }
  });
};

module.exports = task;
