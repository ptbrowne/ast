'use strict';

var fs = require('fs');
var util = require('util');
var es = require('esprima');
var codegen = require('escodegen');
var inspect = function(obj) {
  console.log(util.inspect(obj, false, null));
};

var gid = 0;
var profile = function profile(label) {
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

var codes = fs.readFileSync('input.js');

var ast = es.parse(codes.toString());
codegen.traverse(ast, {
  cursor: 0,
  enter: function(node) {
    var data;

    if ('FunctionDeclaration' === node.type || 'FunctionExpression' === node.type) {
      data = profile(node.id && node.id.name);
      node.body.body.unshift(data.begin);
      node.body.body.push(data.end);
      inspect(node);
      inspect(codegen.generate(node));
    }
  }
});
fs.writeFileSync('output.js', codegen.generate(ast, {
  format: { indent: { style: '  ' } }
}));
