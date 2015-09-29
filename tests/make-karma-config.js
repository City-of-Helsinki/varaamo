/* eslint-disable func-names, no-var */

var webpackConfig = require('../conf/webpack.tests');

module.exports = function(options) {
  var karmaConfig = {
    frameworks: ['mocha', 'chai'],

    browsers: ['PhantomJS2'],

    autoWatch: true,

    files: [
      { pattern: '../node_modules/babel-core/browser-polyfill.js', watched: false },
      { pattern: '../app/**/__tests__/*.js', watched: false },
    ],

    preprocessors: {
      './testBootstrap.js': ['webpack'],
      '../app/**/__tests__/*.js': ['webpack'],
    },

    webpackMiddleware: {
      noInfo: false,
      stats: {
        assets: false,
        chunkModules: false,
        chunks: false,
        colors: true,
        hash: false,
        progress: false,
        timings: true,
        version: false,
      },
    },

    client: {
      captureConsole: !options.disableLogging,
    },

    reporters: ['mocha'],

    plugins: [
      'karma-chai',
      'karma-phantomjs2-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-webpack',
    ],
  };

  if (options.coverage) {
    // Needs to load first to prevent linting issues
    webpackConfig.module.preLoaders = [
      {
        test: /\.js$/,
        exclude: /(__tests__|node_modules|vendor)/,
        loader: 'isparta-instrumenter-loader',
      },
    ].concat(webpackConfig.module.preLoaders);

    karmaConfig.plugins.push('karma-coverage');

    karmaConfig.coverageReporter = {
      dir: '../coverage',
      reporters: options.coverageReporters || [
        { type: 'text' },
        { type: 'text-summary' },
      ],
    };

    karmaConfig.reporters.push('coverage');
  }

  karmaConfig.webpack = webpackConfig;

  return karmaConfig;
};
