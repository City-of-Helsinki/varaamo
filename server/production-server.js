/* eslint-disable func-names, no-console */

import express from 'express';
import path from 'path';

const app = express();
const port = 8080;
const publicPath = path.resolve(__dirname, '../dist');

console.log('Starting production server...');

app.use(express.static(publicPath));

app.listen(port, function() {
  console.log('Production server running on port ' + port);
});
