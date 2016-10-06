import React from 'react';
import { Route } from 'react-router';

import App from 'containers/App';
import UserReservationsPage from 'containers/UserReservationsPage';
import AdminResourcesPage from 'containers/AdminResourcesPage';
import ReservationPage from 'containers/ReservationPage';
import AboutPage from 'screens/about/AboutPage';
import HomePage from 'screens/home/HomePage';
import NotFoundPage from 'screens/not-found/NotFoundPage';
import ResourcePage from 'screens/resource/ResourcePage';
import SearchPage from 'screens/search/SearchPage';

export default (params) => {
  function removeFacebookAppendedHash(nextState, replaceState, cb) {
    if (window.location.hash && window.location.hash.indexOf('_=_') !== -1) {
      replaceState(null, window.location.hash.replace('_=_', ''));
    }
    cb();
  }

  function requireAuth(nextState, replaceState, cb) {
    setTimeout(() => {
      const { auth } = params.getState();

      if (!auth.userId) {
        // To be able to login to a page without the react router "/#/" hash we need to use
        // the window.location.replace instead of the replaceState provided by react router.
        window.location.replace(`${window.location.origin}/login`);
      }
      cb();
    }, 0);
  }

  function scrollTop(nextState, replaceState, cb) {
    window.scrollTo(0, 0);
    cb();
  }

  return (
    <Route component={App} onEnter={removeFacebookAppendedHash}>
      <Route onEnter={requireAuth}>
        <Route component={AdminResourcesPage} path="/admin-resources" />
        <Route component={UserReservationsPage} path="/my-reservations" />
      </Route>
      <Route component={HomePage} onEnter={scrollTop} path="/" />
      <Route component={AboutPage} onEnter={scrollTop} path="/about" />
      <Route component={ResourcePage} onEnter={scrollTop} path="/resources/:id" />
      <Route component={ReservationPage} path="/resources/:id/reservation" />
      <Route component={SearchPage} path="/search" />
      <Route component={NotFoundPage} path="*" />
    </Route>
  );
};
