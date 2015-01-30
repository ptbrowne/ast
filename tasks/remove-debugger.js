'use strict';

var Task = require('../task');

var task = new Task('remove-console-in-production');

var estraverse = require('estraverse');

task.execute = function() {
  estraverse.replace(this.ast, {
    cursor: 0,
    enter: function(node) {
      var data;

      if ('DebuggerStatement' === node.type) {
        // should remove console node instead of setting EmptyStatement
        return estraverse.VisitorOption.Remove;
      }
    }
  });
};

module.exports = task;
