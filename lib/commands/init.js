'use strict';

/**
 * Force initialization questions to be (re-)asked. The resulting answer data is
 * persisted to disk and cached on `app.cache.data`.
 *
 * After questions are answered:
 *
 * - Use `app.data('answers')` to get answer data.
 * - To open the directory where data is persisted, enter `--open answers` in the command line
 *
 * ```sh
 * # ask all questions
 * $ --init
 * # ask all `author.*` questions
 * $ --init "author.*"
 * # ask all `*.name` questions (like `project.name` and `author.name`)
 * $ --init "*.name*"
 * ```
 * @name init
 */

module.exports = function(app) {
  return function(val, next) {
    if (app.options.verbose) {
      console.log('--init is not implemented yet.');
    }
    next();
  };
};
