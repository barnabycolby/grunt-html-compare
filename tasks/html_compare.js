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
            var ignoreSelectors, done, fileA, fileB, fileAPath, fileBPath, resultCallback, options;

            // Merge task-specific and/or target-specific options with these defaults
            options = this.options({
                ignoreMissingSrc: false
            });

            // Perform sanity checks of the result argument
            resultCallback = this.data.result;
            if (resultCallback === undefined) {
                grunt.fail.warn("Missing the result parameter.");
            }
            if (typeof resultCallback !== 'function') {
                grunt.fail.warn("The result parameter should be a function.");
            }

            // Perform sanity checks of the ignoreSelectors option
            ignoreSelectors = options.ignoreSelectors;
            if (ignoreSelectors !== undefined) {
                if (typeof ignoreSelectors === 'string') {
                    ignoreSelectors = [ ignoreSelectors ];
                } else if (!isArrayOfStrings(ignoreSelectors)) {
                    grunt.fail.warn("The ignoreSelectors option must be a string or an array of strings.");
                }
            }

            // Perform sanity checks of the ignoreMissingSrc option and src files
            if (typeof options.ignoreMissingSrc !== 'boolean') {
                grunt.fail.warn("The ignoreMissingSrc option must be a boolean value.");
            }
            if (this.filesSrc.length !== 2) {
                // If the ignoreMissingSrc options is set, we need to silently continue if we are missing src files
                if (options.ignoreMissingSrc) {
                    grunt.log.writeln("Ignoring missing source files.");
                    grunt.verbose.write("Calling result with undefined...");
                    resultCallback(undefined);
                    grunt.verbose.ok();
                    return;
                }

                grunt.fail.warn("You need to specify exactly two source files to compare. (i.e. src: ['a.html', 'b.html'])");
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
                grunt.verbose.write("Parsing first file...");
                jsdom.env(fileA, function (err, aWindow) {
                    if (err !== null) {
                        grunt.fail.warn(fileAPath + " could not be parsed.");
                    }
                    grunt.verbose.ok();

                    grunt.verbose.write("Parsing second file...");
                    jsdom.env(fileB, function (err, bWindow) {
                        var i, j, elementsToRemoveA, elementsToRemoveB, minificationOptions, minifiedAString, minifiedBString, result;

                        if (err !== null) {
                            grunt.fail.warn(fileBPath + " could not be parsed.");
                        }
                        grunt.verbose.ok();

                        // We remove the ignored elements from the dom tree
                        grunt.verbose.write("Removing ignored elements from the DOMs...");
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
                        grunt.verbose.ok();

                        // Before a string match comparison is done, we pass the resulting html through a minifer
                        // This removes unnecessary cruft which can cause comparison errors, without changing the semantics
                        grunt.verbose.write("Minifying files...");
                        minificationOptions = {
                            collapseBooleanAttributes: true,
                            collapseWhitespace: true,
                            minifyCSS: true,
                            minifyJS: true,
                            removeEmptyAttributes: true
                        };
                        try {
                            minifiedAString = minify(aWindow.document.documentElement.outerHTML, minificationOptions);
                            minifiedBString = minify(bWindow.document.documentElement.outerHTML, minificationOptions);
                        } catch (ex) {
                            // Converts the error to a warning
                            grunt.fail.warn(ex);
                        }
                        grunt.verbose.ok();

                        // Computing the result is as simple as a string comparison
                        result = minifiedAString === minifiedBString;
                        grunt.verbose.write("Calling result function...");
                        resultCallback(result);
                        grunt.verbose.ok();

                        // Print a success message
                        grunt.log.ok("Successfully compared " + fileAPath + " with " + fileBPath + ", concluding that they were " + (result ? "identical" : "different") + ".");

                        // Finally we tell grunt that this async task has completed
                        done(true);
                    });
                });
            }
        });
    };
}());
