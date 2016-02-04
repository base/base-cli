'use strict';

var utils = require('../utils');

/**
 * Force initialization questions to be (re-)asked. The resulting answer data is
 * persisted to disk and cached on `app.cache.data`.
 *
 * - Use `app.data('answers')` to get answer data.
 * - Open the directory where data is persisted by entering `--open answers` in the command line
 * ```sh
 * # ask all questions
 * $ --init
 * # ask all `author.*` questions
 * $ --init "author.*"
 * # ask all `*.name` questions (like `project.name` and `author.name`)
 * $ --init "*.name*"
 * ```
 * @name init
 * @cli public
 */

module.exports = function(app) {

  return function(pattern, next) {
    app.questions.use(utils.match());
    app.questions.setData(this.pkg.data)
      .set('author.name', 'Author name?')
      .set('author.username', 'Author username?')
      .set('author.url', 'Author url?')
      .set('project.name', 'What is the project name?', {
        default: this.pkg.get('name')
      })
      .set('project.description', 'What is the project description?', {
        default: this.pkg.get('description')
      });

   if (typeof pattern !== 'string') {
     pattern = /^project/;
   }

   app.questions.match(pattern)
      .on('ask', function(key, question) {
        question.force();
      })
      .ask(function(err, answers) {
        if (err) return next(err);

        app.data({answers: answers});
        next();
      });

  };
};
