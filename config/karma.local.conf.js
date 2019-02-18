const karmaFactory = require('./make-karma-config');

module.exports = (config) => {
  config.set(karmaFactory({
    browsers: ['ChromeDebugging'],
    coverage: true,
    coverageReporters: [
      { type: 'lcov' },
      { type: 'text' },
      { type: 'text-summary' },
    ],
    disableLogging: false,
  }));
};
