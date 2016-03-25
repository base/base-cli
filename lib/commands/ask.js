'use strict';

var debug = require('debug')('base:cli:ask');
var questions = require('../questions');
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
 * $ --ask 'author.*'
 * # ask all `*.name` questions (like `project.name` and `author.name`)
 * $ --ask '*.name*'
 * ```
 * @name ask
 * @cli public
 * @api public
 */

module.exports = function(app, base, options) {
  return function(pattern, key, config, next) {
    app.debug('command > %s: "%j"', key, pattern);

    if (typeof app.questions === 'undefined') {
      next(new Error('expected base-questions plugin to be defined'));
      return;
    }

    debug('asking "%s"', pattern);

    questions(app, options);
    if (pattern === true) {
      app.question('ask.choices', 'Which questions would you like to ask?');
      console.log(app.questions);
      next();
      return;
    }

    var queue = utils.arrayify(pattern).map(function(str) {
      if (!utils.isGlob(str)) {
        str += '(\\.*|)';
      }
      return str;
    });

    // register the `question-match` plugin
    app.questions.use(utils.match());
    app.questions.match(queue);

    app.questions.on('ask', function(question) {
      question.force();
    });

    app.ask(app.questions.queue, function(err, answers) {
      if (err) return next(err);
      debug('answers:\n%j');

      app.data(answers);
      next(null, answers);
    });
  };
};
