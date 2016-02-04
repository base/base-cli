'use strict';

module.exports = function(app) {
  return function(tasks, next) {
    app.generateEach(tasks, next);
  };
};
