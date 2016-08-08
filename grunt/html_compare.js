/*global module */
(function () {
    'use strict';

    var doNothingFunction = function (result) {
        // The return simply keeps jslint happy
        return result;
    };

    module.exports = function (grunt) {
        /**
         * Callers must use currying, passing only the path of the file to write
         * A function is returned that can be passed directly as the result argument
         */
        var writeFileIfTrue = function (path) {
            return function (result) {
                if (result) {
                    grunt.file.write(path, '');
                }
            };
        };

        return {
            missing_result: {
                src: ['test/a/identical.html', 'test/b/identical.html']
            },
            no_source_files: {
                result: doNothingFunction
            },
            less_than_2_source_files: {
                src: ['test/a/identical.html'],
                result: doNothingFunction
            },
            more_than_2_source_files: {
                src: ['test/a/identical.html', 'test/b/identical.html', 'test/c/identical.html'],
                result: doNothingFunction
            },
            result_is_not_a_function: {
                src: ['test/a/identical.html', 'test/b/identical.html'],
                result: 'beans'
            },
            identical_files: {
                src: ['test/a/identical.html', 'test/b/identical.html'],
                result: writeFileIfTrue('tmp/identical_files')
            },
            different_files: {
                src: ['test/a/different.html', 'test/b/different.html'],
                result: writeFileIfTrue('tmp/different_files')
            },
            ignore_selectors_incorrect_type: {
                options: {
                    ignoreSelectors: ['sausages', 3]
                },
                src: ['test/a/identical.html', 'test/b/identical.html'],
                result: doNothingFunction
            },
            ignore_selectors_string: {
                options: {
                    ignoreSelectors: '#id'
                },
                src: ['test/a/identical.html', 'test/b/identical.html'],
                result: doNothingFunction
            },
            ignore_selectors_string_array: {
                options: {
                    ignoreSelectors: ['#id', '.container']
                },
                src: ['test/a/identical.html', 'test/b/identical.html'],
                result: doNothingFunction
            }
        };
    };
}());
