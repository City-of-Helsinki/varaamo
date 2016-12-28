import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import createLogger from 'redux-logger';

import persistState from './persistState';
import tracking from './tracking';

const isDevelopment = process.env.NODE_ENV !== 'production';
const storeEnhancers = [
  applyMiddleware(apiMiddleware),
  applyMiddleware(tracking),
  persistState,
];

if (isDevelopment) {
  const loggerMiddleware = createLogger({
    collapsed: true,
    duration: true,
  });
  storeEnhancers.push(applyMiddleware(loggerMiddleware));
}

export default storeEnhancers;
