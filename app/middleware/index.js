/* eslint-disable global-require */
import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import createLogger from 'redux-logger';

import tracking from 'middleware/tracking';

const isDevelopment = process.env.NODE_ENV !== 'production';
const storeEnhancers = [applyMiddleware(apiMiddleware), applyMiddleware(tracking)];

if (isDevelopment) {
  const loggerMiddleware = createLogger({
    collapsed: true,
    duration: true,
  });
  storeEnhancers.push(applyMiddleware(loggerMiddleware));
  if (__DEVTOOLS__) {
    const { devTools, persistState } = require('redux-devtools');

    storeEnhancers.push(devTools());
    storeEnhancers.push(persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)));
  }
}

export default storeEnhancers;
