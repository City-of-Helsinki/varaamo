const karmaFactory = require('./make-karma-config');

module.exports = (config) => {
  config.set(karmaFactory({
    browsers: ['Chrome'],
    coverage: true,
    coverageReporters: [
      { type: 'html' },
      { type: 'text' },
      { type: 'text-summary' },
    ],
    disableLogging: true,
  }));
};
