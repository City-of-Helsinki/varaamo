/* eslint-disable no-var, prefer-arrow-callback, prefer-template */

var express = require('express');
var path = require('path');

var app = express();
var port = 8080;
var publicPath = path.resolve(__dirname, './dist');

console.log('Starting production server...');

app.use(express.static(publicPath));

app.listen(port, function() {
  console.log('Production server running on port ' + port);
});
