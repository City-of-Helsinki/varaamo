const webpackConfig = require('./webpack.tests');

module.exports = (options) => {
  const karmaConfig = {
    frameworks: ['mocha', 'chai', 'intl-shim'],

    browsers: options.browsers || ['PhantomJS'],

    // Allow enough time for tests to build on CI.
    browserNoActivityTimeout: 5 * 60000,

    autoWatch: true,

    files: [
      { pattern: './specs.bootstrap.js', watched: false },
    ],

    preprocessors: {
      './specs.bootstrap.js': ['webpack', 'sourcemap'],
    },

    customLaunchers: {
      ChromeDebugging: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333'],
      },
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

    mochaReporter: {
      showDiff: true,
    },

    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-intl-shim',
      'karma-mocha-reporter',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
  };

  if (options.coverage) {
    karmaConfig.plugins.push('karma-coverage-istanbul-reporter');

    karmaConfig.coverageIstanbulReporter = {
      dir: '../coverage',
      reporters: options.coverageReporters || [
        { type: 'lcov' },
        { type: 'text' },
        { type: 'text-summary' },
      ],
    };

    karmaConfig.reporters.push('coverage-istanbul');
  }

  karmaConfig.webpack = webpackConfig;

  return karmaConfig;
};
