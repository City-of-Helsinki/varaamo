const karmaFactory = require('./make-karma-config');

module.exports = (config) => {
  config.set(karmaFactory({}));
};
