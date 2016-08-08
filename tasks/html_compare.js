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

        var isArrayOfStrings = function (object) {
            var i;

            // First we check whether the object is an array
            if (Object.prototype.toString.call(object) !== '[object Array]') {
                return false;
            }

            // Next we check whether the array is a string array
            for (i = 0; i < object.length; i += 1) {
                if (typeof object[i] !== 'string') {
                    return false;
                }
            }

            return true;
        };

        grunt.registerMultiTask('html_compare', 'Compares two HTML files, passing the result to a user defined function.', function () {
            var ignoreSelectors, result;

            // Perform sanity checks
            if (this.data.result === undefined) {
                grunt.fail.warn("Missing the result parameter.");
            }
            if (this.filesSrc.length !== 2) {
                grunt.fail.warn("You need to specify exactly two source files to compare. (i.e. src: ['a.html', 'b.html'])");
            }
            if (typeof this.data.result !== 'function') {
                grunt.fail.warn("The result parameter should be a function.");
            }

            // Perform sanity checks of the ignoreSelectors option
            ignoreSelectors = this.options().ignoreSelectors;
            if (ignoreSelectors !== undefined && typeof ignoreSelectors !== 'string' && !isArrayOfStrings(ignoreSelectors)) {
                grunt.fail.warn("The ignoreSelectors option must be a string or an array of strings.");
            }

            // As we don't care about the format of the files, we can simply compare them directly
            result = grunt.file.read(this.filesSrc[0]) === grunt.file.read(this.filesSrc[1]);
            this.data.result(result);
        });
    };
}());
