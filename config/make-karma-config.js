const webpackConfig = require('./webpack.tests');

module.exports = (options) => {
  const karmaConfig = {
    frameworks: ['mocha', 'chai'],

    browsers: options.browsers || ['PhantomJS'],

    // Allow enough time for tests to build on CI.
    browserNoActivityTimeout: 5 * 60000,

    autoWatch: true,

    files: [
      { pattern: './specs.bootstrap.js', watched: false },
    ],

    preprocessors: {
      './specs.bootstrap.js': ['webpack'],
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
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
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
        exclude: /(__tests__|config|node_modules)/,
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
