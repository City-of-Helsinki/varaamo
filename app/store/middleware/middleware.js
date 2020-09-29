import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';

import tracking from './tracking';
import accessibility from './accessibility';

const storeEnhancers = [
  applyMiddleware(thunk),
  applyMiddleware(apiMiddleware),
  applyMiddleware(tracking),
  applyMiddleware(accessibility),
];

export default storeEnhancers;
