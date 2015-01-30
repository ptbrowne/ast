'use strict';

var Task = require('../task');
var task = new Task('remove-console-in-production');
var estraverse = require('estraverse');
var _ = require('underscore');
var console = require('console');

var reorder = function (arr, indices) {
  var res = [];
  for (var i = 0; i < indices.length; i++) {
    res.push(arr[indices[i]]);
  }
  return res;
};

var _priorities = _.map([
  'app',
  'marionette',
  'underscore',
  'views/',
  'models/'
], function (v,k) { return [k,v]; });

var priority = function (name) {
  var found = _.find(_priorities, function (n) {
    var rx = new RegExp(n[1]);
    var test = rx.test(name);
    return test;
  });
  return found ? found[0] : Infinity;
};

var annotate = function (arr, fn) {
  return _.map(arr, function (n) { return [n, fn(n)]; });
};

var getOrder = function (names) {
  var priorities = _.pluck(_.sortBy(annotate(names, priority), 1), 0);
  var order = _.map(priorities, function (n) { return names.indexOf(n); });
  return order;
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
        var elems = arr.elements.slice(0, nbParams);
        var rest = arr.elements.slice(nbParams);
        var order = getOrder(_.pluck(elems, 'value'));
        arr.elements = reorder(elems, order).concat(rest);
        fn.params = reorder(fn.params, order);
      }
    }
  });
};

module.exports = task;
