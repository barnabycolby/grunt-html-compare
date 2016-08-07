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
        multiple_source_file_sets: {
            files: [
                { src: ['test/a/identical.html', 'test/b/identical.html'] },
                { src: ['test/a/identical.html', 'test/b/identical.html'] }
            ],
            result: doNothingFunction
        }
    };
}());
