module.exports = function karmaConfig(config) {
  config.set({
    frameworks: [
      'mocha'
    ],

    reporters: [
      'spec',
      'coverage'
    ],

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests/**/*.js'
    ],

    preprocessors: {
      'tests/**/*.js': ['webpack', 'sourcemap']
    },

    browsers: [
      'jsdom'
    ],

    coverageReporter: {
      dir: 'build/coverage/',
      type: 'html'
    },

    webpack: require('./webpack.tests2.config.js'),

    webpackMiddleware: {
      noInfo: true
    }
  });
};
