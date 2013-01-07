'use strict';

var fs = require('fs');
var util = require('util');
var es = require('esprima');
var codegen = require('escodegen');
var inspect = function(obj) {
  console.log(util.inspect(obj, false, null));
};

var codes = fs.readFileSync('testing.js');

var ast = es.parse(codes.toString());

codegen.traverse(ast, {
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
fs.writeFileSync('output.js', codegen.generate(ast, {
  format: { indent: { style: '  ' } }
}));
