import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';

import tracking from './tracking';

const storeEnhancers = [
  applyMiddleware(thunk),
  applyMiddleware(apiMiddleware),
  applyMiddleware(tracking),
];

export default storeEnhancers;
