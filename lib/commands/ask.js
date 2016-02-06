'use strict';

var utils = require('../utils');

/**
 * Force questions that match the given pattern to be asked. The resulting
 * answer data is merged onto `app.cache.data`.
 *
 * After questions are answered:
 *
 * - Use `app.data('answers')` to get answer data.
 * - To open the directory where data is persisted, enter `--open answers` in the command line
 *
 * ```sh
 * # ask all questions
 * $ --ask
 * # ask all `author.*` questions
 * $ --ask "author.*"
 * # ask all `*.name` questions (like `project.name` and `author.name`)
 * $ --ask "*.name*"
 * ```
 * @name ask
 * @cli public
 * @api public
 */

module.exports = function(app) {
  return function(pattern, next) {
    if (typeof app.questions === 'undefined') {
      next(new Error('expected base-questions plugin to be defined'));
      return;
    }

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

   app.questions.match(pattern || '*')
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
