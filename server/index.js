require('@babel/register');

const serverConfig = require('./config');

// To ignore webpack custom loaders on server.
serverConfig.webpackStylesExtensions.forEach((ext) => {
  require.extensions[`.${ext}`] = () => {};
});

require('./main');
