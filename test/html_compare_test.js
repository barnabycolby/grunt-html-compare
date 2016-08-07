/*global require, exports */
(function () {
    'use strict';

    var exec = require('child_process').exec;

    /*
        ======== A Handy Little Nodeunit Reference ========
        https://github.com/caolan/nodeunit

        Test methods:
            test.expect(numAssertions)
            test.done()
        Test assertions:
            test.ok(value, [message])
            test.equal(actual, expected, [message])
            test.notEqual(actual, expected, [message])
            test.deepEqual(actual, expected, [message])
            test.notDeepEqual(actual, expected, [message])
            test.strictEqual(actual, expected, [message])
            test.notStrictEqual(actual, expected, [message])
            test.throws(block, [error], [message])
            test.doesNotThrow(block, [error], [message])
            test.ifError(value)
    */

    exports.html_compare = {
        missing_result: function (test) {
            test.expect(1);

            // Run the missing_result target and check that it fails with a warning
            exec('grunt html_compare:missing_result', function (error) {
                var errorMessage = "The task should fail with a warning if the result argument is undefined.";
                if (!error) {
                    test.ok(false, errorMessage);
                }

                test.equal(error.code, 6, errorMessage);
                test.done();
            });
        }
    };
}());
