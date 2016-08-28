/* eslint-disable func-names, prefer-template, no-var, vars-on-top */
require('babel-core/register');
require('dotenv').load();

var serverConfig = require('./config');

// To ignore webpack custom loaders on server.
serverConfig.webpackStylesExtensions.forEach(function (ext) {
  require.extensions['.' + ext] = function () {};
});

require('./main');
