require('babel-core/register');

global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

if (__DEVELOPMENT__) {
  require('./dev-server');
} else {
  require('./production-server');
}
