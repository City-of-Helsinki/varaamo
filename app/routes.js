import React from 'react';
import { Route } from 'react-router';

import App from 'containers/App';
import HomePage from 'containers/HomePage';
import ReservationPage from 'containers/ReservationPage';
import ResourcePage from 'containers/ResourcePage';
import SearchPage from 'containers/SearchPage';

export default (
  <Route component={App}>
    <Route component={HomePage} path="/" />
    <Route component={ResourcePage} path="/resources/:id" />
    <Route component={ReservationPage} path="/resources/:id/reservation" />
    <Route component={SearchPage} path="/search" />
  </Route>
);
