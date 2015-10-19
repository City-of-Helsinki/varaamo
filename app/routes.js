import React from 'react';
import { Route } from 'react-router';

import App from 'containers/App';
import HomePage from 'containers/HomePage';
import LoginPage from 'containers/LoginPage';
import UserReservationsPage from 'containers/UserReservationsPage';
import NotFoundPage from 'containers/NotFoundPage';
import ReservationPage from 'containers/ReservationPage';
import ResourcePage from 'containers/ResourcePage';
import SearchPage from 'containers/SearchPage';

export default (params) => {
  function requireAuth(nextState, replaceState, cb) {
    setTimeout(() => {
      const { auth } = params.getState();

      if (!auth.userId) {
        replaceState(null, '/login');
      }
      cb();
    }, 0);
  }

  return (
    <Route component={App}>
      <Route onEnter={requireAuth}>
        <Route component={UserReservationsPage} path="/my-reservations" />
      </Route>
      <Route component={HomePage} path="/" />
      <Route component={LoginPage} path="/login" />
      <Route component={ResourcePage} path="/resources/:id" />
      <Route component={ReservationPage} path="/resources/:id/reservation" />
      <Route component={SearchPage} path="/search" />
      <Route component={NotFoundPage} path="*" />
    </Route>
  );
};
