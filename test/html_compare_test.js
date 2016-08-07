/*global require, exports */
(function () {
    'use strict';

    var exec = require('child_process').exec;

    /*
     * Tests that a given html_compare grunt target fails with a warning.
     *
     * @test The nodeunit test object to use
     * @target The html_compare target to run
     * @errorMessage The error message to print if the task does not fail with a warning.
     */
    function expectGruntWarning(test, target, errorMessage) {
        test.expect(1);

        // Run the grunt target and check that it fails with a warning
        exec('grunt html_compare:' + target, function (error) {
            if (error === undefined || error === null) {
                test.ok(false, errorMessage);
            } else {
                // Grunt terminates with exit code 6 for warnings
                test.equal(error.code, 6, errorMessage);
            }

            test.done();
        });
    }

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
            var errorMessage = "The task should fail with a warning if the result argument is undefined.";
            expectGruntWarning(test, "missing_result", errorMessage);
        },
        no_source_files: function (test) {
            var errorMessage = "The task should fail with a warning if no source files are specified.";
            expectGruntWarning(test, "no_source_files", errorMessage);
        },
        multiple_source_file_sets: function (test) {
            var errorMessage = "The task should fail with a warning if more than one set of source files are specified.";
            expectGruntWarning(test, "multiple_source_file_sets", errorMessage);
        },
        less_than_2_source_files: function (test) {
            var errorMessage = "The task should fail with a warning if less than two source files are specified.";
            expectGruntWarning(test, "less_than_2_source_files", errorMessage);
        },
        more_than_2_source_files: function (test) {
            var errorMessage = "The task should fail with a warning if more than two source files are specified.";
            expectGruntWarning(test, "more_than_2_source_files", errorMessage);
        }
    };
}());
