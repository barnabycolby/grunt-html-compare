# grunt-html-compare

> Compares two HTML files, passing the result to a user defined function.

[![Build Status](https://travis-ci.org/barnabycolby/grunt-html-compare.svg?branch=master)](https://travis-ci.org/barnabycolby/grunt-html-compare)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-html-compare --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-compare');
```

## The "html_compare" task

### Overview
In your project's Gruntfile, add a section named `html_compare` to the data object passed into `grunt.initConfig()`.

#### result
Type: `function`

You must provide a `result` parameter, which should be a function that takes a single boolean argument. The function will be invoked once the comparison result is known, with the first argument indicating the result (true if the files are the same, false otherwise).

```js
grunt.initConfig({
  html_compare: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
      result: function (result) {
        ...
      }
    },
  },
});
```

### Options

#### options.ignoreSelectors
Type: `String` or `String Array`
Default value: `undefined`

One or more CSS selectors that describe nodes to be ignored during the comparison.

### Usage Examples

#### Default Options
In this example, the default options are used to delete one of the two HTML files if they are the same.

```js
grunt.initConfig({
  html_compare: {
    options: {},
    src: ['a.html', 'b.html'],
    result: function (result) {
      if (result) {
        grunt.file.delete('b.html');
      }
    }
  },
});
```

#### Custom Options
In this example, the ignoreSelectors option is used to compare differences in two HTML files, whilst ignoring the last updated date. If there are no differences then the current file is kept, preserving the date.

```js
grunt.initConfig({
  html_compare: {
    options: {
      ignoreSelectors: '#lastUpdated'
    },
    src: ['index.html', 'index.new.html'],
    result: function (result) {
      if (result) {
        grunt.file.delete('index.new.html');
      } else {
        grunt.file.delete('index.html');

        // Rename using copy and delete
        grunt.file.copy('index.new.html', 'index.html');
        grunt.file.delete('index.new.html');
      }
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/). If creating a new feature, consider opening an issue first, otherwise just submit a pull request.

## Release History
_(Nothing yet)_
