import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import createLogger from 'redux-logger';

const isDevelopment = process.env.NODE_ENV !== 'production';
const storeEnhancers = [applyMiddleware(apiMiddleware)];

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
