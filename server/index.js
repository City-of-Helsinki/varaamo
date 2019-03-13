require('@babel/register');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const serverConfig = require('./config');

// To ignore webpack custom loaders on server.
serverConfig.webpackStylesExtensions.forEach((ext) => {
  require.extensions[`.${ext}`] = () => {};
});

require('./main');
