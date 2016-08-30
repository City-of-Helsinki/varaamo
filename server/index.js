require('babel-core/register');
require('dotenv').load();

const serverConfig = require('./config');

// To ignore webpack custom loaders on server.
serverConfig.webpackStylesExtensions.forEach((ext) => {
  require.extensions[`.${ext}`] = () => {};
});

require('./main');
