var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');
var Task = require('./tasks/task');

var Host = (function() {
  return {
    init: function(filename) {
      this.tasks = [];
      this.escodegen = escodegen;
      try {
        this.codes = fs.readFileSync(filename).toString();
        this.ast = esprima.parse(this.codes);
      } catch(e) {
      }
    },
    addTask: function(task) {
      if (!(task instanceof Task)) {
        throw new Error("failed: invalid task");
      }
      this.tasks.push(task);
    },
    run: function() {
      var self = this;
      this.tasks.forEach(function(t) {
        t.execute.call(self);
      });
      return this;
    },
    write: function(filename) {
      fs.writeFileSync(filename, escodegen.generate(this.ast));
      return this;
    }
  }
}());

Host.init('./input.js');
Host.addTask(require('./tasks/added-profile-timer'));
Host.addTask(require('./tasks/remove-console-in-production'));
Host.run().write('output.js');
