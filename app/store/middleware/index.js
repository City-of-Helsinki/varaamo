import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';

import tracking from './tracking';

const middleware = [
  thunk,
  apiMiddleware,
  tracking,
];

export default middleware;
