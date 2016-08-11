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
            invalid_html: {
                options: {
                    ignoreSelectors: ['sausages']
                },
                src: ['test/a/invalid.html', 'test/b/invalid.html'],
                result: doNothingFunction
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
            },
            ignore_selectors_invalid_selector: {
                options: {
                    ignoreSelectors: ['#id', ':*d fdas$']
                },
                src: ['test/a/identical.html', 'test/b/identical.html'],
                result: doNothingFunction
            },
            ignore_selectors_identical_files: {
                options: {
                    ignoreSelectors: '.jumbotron > .lead'
                },
                src: ['test/a/identical.html', 'test/b/identical.html'],
                result: writeFileIfTrue('tmp/ignore_selectors_identical_files')
            },
            ignore_selectors_different_only_in_selected: {
                options: {
                    ignoreSelectors: '#lastUpdated'
                },
                src: ['test/a/differentOnlyInSelected.html', 'test/b/differentOnlyInSelected.html'],
                result: writeFileIfTrue('tmp/ignore_selectors_different_only_in_selected')
            },
            ignore_selectors_different_in_non_selected: {
                options: {
                    ignoreSelectors: '.container h1'
                },
                src: ['test/a/different.html', 'test/b/different.html'],
                result: writeFileIfTrue('tmp/ignore_selectors_different_in_non_selected')
            },
            ignore_missing_src_non_boolean: {
                options: {
                    ignoreMissingSrc: 'Bananas'
                },
                src: ['test/a/identical.html', 'test/b/identical.html'],
                result: doNothingFunction
            },
            ignore_missing_src: {
                options: {
                    ignoreMissingSrc: true
                },
                result: doNothingFunction
            }
        };
    };
}());
