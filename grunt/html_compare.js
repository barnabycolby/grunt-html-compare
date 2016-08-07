/*global module */
(function () {
    'use strict';

    module.exports = {
        missing_result: {
            src: ['test/a/identical.html', 'test/b/identical.html']
        },
        no_source_files: {
            result: function (result) {
                // The return simply keeps jslint happy
                return result;
            }
        }
    };
}());
