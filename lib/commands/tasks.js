'use strict';

/**
 * Run the given generators and tasks. This flag is unnecessary when
 * used with [base-runner].
 *
 * ```sh
 * $ app --tasks foo
 * # {tasks: ['foo']}
 * # Runs task "foo"
 * $ app --tasks foo:bar
 * # {tasks: ['foo:bar']}
 * # Runs generator "foo", task "bar"
 * ```
 * @name tasks
 * @api public
 * @cli public
 */

module.exports = function(app) {
  return function(tasks, next) {
    app.generateEach(tasks, next);
  };
};
