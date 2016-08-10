/*global module, require */
(function () {
    /*
     * grunt-html-compare
     * https://github.com/barnabycolby/grunt-html-compare
     *
     * Copyright (c) 2016 Barnaby Colby
     * Licensed under the MIT license.
     */

    'use strict';

    var jsdom = require('jsdom'),
        minify = require('html-minifier').minify;

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
            var ignoreSelectors, done, fileA, fileB, fileAPath, fileBPath, resultCallback;

            // Perform sanity checks
            resultCallback = this.data.result;
            if (resultCallback === undefined) {
                grunt.fail.warn("Missing the result parameter.");
            }
            if (this.filesSrc.length !== 2) {
                grunt.fail.warn("You need to specify exactly two source files to compare. (i.e. src: ['a.html', 'b.html'])");
            }
            if (typeof resultCallback !== 'function') {
                grunt.fail.warn("The result parameter should be a function.");
            }

            // Perform sanity checks of the ignoreSelectors option
            ignoreSelectors = this.options().ignoreSelectors;
            if (ignoreSelectors !== undefined) {
                if (typeof ignoreSelectors === 'string') {
                    ignoreSelectors = [ ignoreSelectors ];
                } else if (!isArrayOfStrings(ignoreSelectors)) {
                    grunt.fail.warn("The ignoreSelectors option must be a string or an array of strings.");
                }
            }

            fileAPath = this.filesSrc[0];
            fileBPath = this.filesSrc[1];
            fileA = grunt.file.read(fileAPath);
            fileB = grunt.file.read(fileBPath);
            if (ignoreSelectors === undefined) {
                resultCallback(fileA === fileB);
            } else {
                // As jsdom is asynchronous, we need the grunt task to be asynchronous too
                done = this.async();

                // We parse the files into DOM structures, allowing us to handle the CSS selectors properly
                jsdom.env(fileA, function (err, aWindow) {
                    if (err !== null) {
                        grunt.fail.warn(fileAPath + " could not be parsed.");
                    }

                    jsdom.env(fileB, function (err, bWindow) {
                        var i, j, elementsToRemoveA, elementsToRemoveB, minificationOptions, minifiedAString, minifiedBString;

                        if (err !== null) {
                            grunt.fail.warn(fileBPath + " could not be parsed.");
                        }

                        // We remove the ignored elements from the dom tree
                        for (i = 0; i < ignoreSelectors.length; i += 1) {
                            // First we try to get a list of the elements that need to be removed
                            try {
                                elementsToRemoveA = aWindow.document.querySelectorAll(ignoreSelectors[i]);
                                elementsToRemoveB = bWindow.document.querySelectorAll(ignoreSelectors[i]);
                            } catch (ex) {
                                grunt.fail.warn("The selector '" + ignoreSelectors[i] + "' is invalid.");
                            }

                            // And now we actually remove them
                            for (j = 0; j < elementsToRemoveA.length; j += 1) {
                                elementsToRemoveA[j].remove();
                            }
                            for (j = 0; j < elementsToRemoveB.length; j += 1) {
                                elementsToRemoveB[j].remove();
                            }
                        }

                        // Before a string match comparison is done, we pass the resulting html through a minifer
                        // This removes unnecessary cruft which can cause comparison errors, without changing the semantics
                        minificationOptions = {
                            collapseBooleanAttributes: true,
                            collapseWhitespace: true,
                            minifyCSS: true,
                            minifyJS: true,
                            removeEmptyAttributes: true
                        };
                        minifiedAString = minify(aWindow.document.documentElement.outerHTML, minificationOptions);
                        minifiedBString = minify(bWindow.document.documentElement.outerHTML, minificationOptions);

                        // Computing the result is as simple as a string comparison
                        resultCallback(minifiedAString === minifiedBString);

                        // Finally we tell grunt that this async task has completed
                        done(true);
                    });
                });
            }
        });
    };
}());
