'use strict';

var Task = require('../task');
var task = new Task('remove-console-in-production');
var estraverse = require('estraverse');
var _ = require('underscore');
var console = require('console');

var enumerate = function (arr) {
  return _.map(arr, function (v,k) { return [k,v]; });
};

var _priorities = enumerate([
  'app',
  'marionette',
  'underscore',
  'views/',
  'models/'
]);

var priority = function (name) {
  var found = _.find(_priorities, function (n) {
    return new RegExp(n[1]).test(name);
  });
  return found ? found[0] : Infinity;
};

var multiSort = function (arrs, fn) {
  var zipped = _.zip.apply(_, arrs);
  var sorted = _.sortBy(zipped, function (d) { return fn.apply(null, d); });
  var unzipped = _.zip.apply(_, sorted);
  return unzipped;
};

task.execute = function() {
  estraverse.replace(this.ast, {
    cursor: 0,
    enter: function(node) {
      if ('ExpressionStatement' === node.type &&
          'CallExpression' === node.expression.type &&
          'define' === node.expression.callee.name) {
        var fn = node.expression.arguments[1];
        var nbParams = fn.params.length;
        var arr = node.expression.arguments[0];
        var named_deps = arr.elements.slice(0, nbParams);
        var rest = arr.elements.slice(nbParams);
        var sorted = multiSort([named_deps, fn.params], function (dep, param) { return priority(dep.value); });
        arr.elements = sorted[0].concat(rest);
        fn.params = sorted[1];
      }
    }
  });
};

module.exports = task;
