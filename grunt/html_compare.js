/*global module */
(function () {
    'use strict';

    var doNothingFunction = function (result) {
        // The return simply keeps jslint happy
        return result;
    };

    module.exports = {
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
        }
    };
}());
