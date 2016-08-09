/*global require, exports */
(function () {
    'use strict';

    var exec = require('child_process').exec,
        grunt = require('grunt');

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
        less_than_2_source_files: function (test) {
            var errorMessage = "The task should fail with a warning if less than two source files are specified.";
            expectGruntWarning(test, "less_than_2_source_files", errorMessage);
        },
        more_than_2_source_files: function (test) {
            var errorMessage = "The task should fail with a warning if more than two source files are specified.";
            expectGruntWarning(test, "more_than_2_source_files", errorMessage);
        },
        result_is_not_a_function: function (test) {
            var errorMessage = "The task should fail with a warning if the result argument is not a function.";
            expectGruntWarning(test, "result_is_not_a_function", errorMessage);
        },
        ignore_selectors_incorrect_type: function (test) {
            var errorMessage = "The task should fail with a warning if the ignoreSelectors option is not a string or an array of strings.";
            expectGruntWarning(test, "ignore_selectors_incorrect_type", errorMessage);
        },
        ignore_selectors_invalid_selector: function (test) {
            var errorMessage = "The task should fail with a warning if the ignoreSelectors option contains an invalid selector.";
            expectGruntWarning(test, "ignore_selectors_invalid_selector", errorMessage);
        },
        identical_files: function (test) {
            test.expect(1);
            test.ok(grunt.file.exists('tmp/identical_files'), 'Comparison of two identical files should return true');
            test.done();
        },
        different_files: function (test) {
            test.expect(1);
            test.ok(!grunt.file.exists('tmp/different_files'), 'Comparison of two different files should return false');
            test.done();
        },
        ignore_selectors_identical_files: function (test) {
            test.expect(1);
            test.ok(grunt.file.exists('tmp/ignore_selectors_identical_files'), 'Comparison of two identical files should return true regardless of the ignored selectors.');
            test.done();
        },
        ignore_selectors_different_only_in_selected: function (test) {
            test.expect(1);
            test.ok(grunt.file.exists('tmp/ignore_selectors_different_only_in_selected'), 'Comparison of two files that differ only in ignored elements should return true.');
            test.done();
        },
        ignore_selectors_different_in_non_selected: function (test) {
            test.expect(1);
            test.ok(!grunt.file.exists('tmp/ignore_selectors_different_in_non_selected'), 'Comparison of two files that differ outside of ignored elements should return false.');
            test.done();
        }
    };
}());
