import React from 'react';
import {Route} from 'react-router';

import App from 'containers/App';
import HomePage from 'containers/HomePage';
import SearchPage from 'containers/SearchPage';

export default (
  <Route component={App}>
    <Route component={HomePage} path='/' />
    <Route component={SearchPage} path='/search' />
  </Route>
);
