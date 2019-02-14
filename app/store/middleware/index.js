import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';

import persistState from './persistState';
import tracking from './tracking';

const storeEnhancers = [
  applyMiddleware(thunk),
  applyMiddleware(apiMiddleware),
  applyMiddleware(tracking),
  persistState,
];

export default storeEnhancers;
