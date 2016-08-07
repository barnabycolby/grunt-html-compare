/*global module */
(function () {
    /*
     * grunt-html-compare
     * https://github.com/barnabycolby/grunt-html-compare
     *
     * Copyright (c) 2016 Barnaby Colby
     * Licensed under the MIT license.
     */

    'use strict';

    module.exports = function (grunt) {

        // Please see the Grunt documentation for more information regarding task
        // creation: http://gruntjs.com/creating-tasks

        grunt.registerMultiTask('html_compare', 'Compares two HTML files, passing the result to a user defined function.', function () {
            // Perform sanity checks
            if (this.data.result === undefined) {
                grunt.fail.warn("Missing the result parameter.");
            }
            if (this.files.length !== 1) {
                grunt.fail.warn("You need to specify exactly one set of source files to compare.");
            }

            /* Merge task-specific and/or target-specific options with these defaults.
            var options = this.options({
                punctuation: '.',
                separator: ', '
            });
            */
        });
    };
}());
