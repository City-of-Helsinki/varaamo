/* eslint-disable func-names, no-var */

var karmaFactory = require('./make-karma-config');

module.exports = function(config) {
  config.set(karmaFactory({
    coverage: true,
    coverageReporters: [
      { type: 'text' },
      { type: 'text-summary' },
    ],
    disableLogging: true,
  }));
};
