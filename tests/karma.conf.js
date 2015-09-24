/* eslint-disable no-var */

var karmaFactory = require('./make-karma-config');

module.exports = function(config) {
  config.set(karmaFactory({}));
};
