module.exports = {
    default_options: {
        options: {
        },
        files: {
            'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
    },
    custom_options: {
        options: {
            separator: ': ',
            punctuation: ' !!!'
        },
        files: {
            'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
    }
};
