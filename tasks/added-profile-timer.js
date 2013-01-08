'use strict';

var Task = require('../task');

var gid = 0;
var profile = function(label) {
  var time = {
    begin: {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          computed: false,
          object: { type: 'Identifier', name: 'console' },
          property: { type: 'Identifier', name: 'time' }
        },
        arguments: [{ type: 'Literal', value: null }]
      }
    },

    end: {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          computed: false,
          object: { type: 'Identifier', name: 'console' },
          property: { type: 'Identifier', name: 'timeEnd' }
        },
        arguments: [{ type: 'Literal', value: null }]
      }
    }
  };

  if (!label) { label = 'anonymous:' + (gid++); }
  time.begin.expression.arguments[0].value = label;
  time.end.expression.arguments[0].value = label;
  return time;
};

var task = new Task('added-profile-timer');

task.execute = function() {
  this.escodegen.traverse(this.ast, {
    cursor: 0,
    enter: function(node) {
      var data;

      if ('FunctionDeclaration' === node.type || 'FunctionExpression' === node.type) {
        data = profile(node.id && node.id.name);
        node.body.body.unshift(data.begin);
        node.body.body.push(data.end);
      }
    }
  });
};

module.exports = task;
