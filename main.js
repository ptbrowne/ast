var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');
var glob = require('glob');
var Task = require('./task');

var Host = (function() {
  return {

    /**
     * @method init
     * @param {String} filename file name
     * @description initialize
     */
    init: function(filename) {
      this.tasks = [];
      this.escodegen = escodegen;
      try {
        this.codes = fs.readFileSync(filename).toString();
        this.ast = esprima.parse(this.codes);
      } catch(e) {
        console.error(e);
      }
    },

    /**
     * @method addTask
     * @param {Task} task a instance of `Task`
     * @description add Task into queue
     * @chainable
     */
    addTask: function(task) {
      if (!(task instanceof Task)) {
        throw new Error("failed: invalid task");
      }
      this.tasks.push(task);
      return this;
    },

    /**
     * @method run
     * @description running registered tasks synchrously
     * @chainable
     */
    run: function() {
      var self = this;
      this.tasks.forEach(function(t) {
        t.execute.call(self);
      });
      return this;
    },

    /**
     * @method write
     * @param {String} filename output filename
     * @description write processed AST to a file
     * @chainable
     */
    write: function(filename) {
      fs.writeFileSync(filename, escodegen.generate(this.ast));
      return this;
    }
  }
}());

Host.init('./input.js');
glob('./tasks/*.js', function(err, files) {
  files.forEach(function(f) {
    Host.addTask(require(f));
  });
  Host.run().write('output.js');
});
