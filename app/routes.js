import React from 'react';
import { IndexRoute, Redirect, Route } from 'react-router';

import AppContainer from 'pages/AppContainer';
import AboutPage from 'pages/about';
import AdminResourcesPage from 'pages/admin-resources';
import HomePage from 'pages/home';
import NotFoundPage from 'pages/not-found';
import ResourcePage from 'pages/resource';
import SearchPage from 'pages/search';
import UserReservationsPage from 'pages/user-reservations';

export default (params) => {
  function removeFacebookAppendedHash(nextState, replace, callback) {
    if (window.location.hash && window.location.hash.indexOf('_=_') !== -1) {
      replace(window.location.hash.replace('_=_', ''));
    }
    callback();
  }

  function requireAuth(nextState, replace, callback) {
    setTimeout(() => {
      const { auth } = params.getState();

      if (!auth.userId) {
        // To be able to login to a page without the react router "/#/" hash we need to use
        // the window.location.replace instead of the replaceState provided by react router.
        window.location.replace(`${window.location.origin}/login`);
      }
      callback();
    }, 0);
  }

  function scrollTop(nextState, replace, callback) {
    window.scrollTo(0, 0);
    callback();
  }

  return (
    <Route component={AppContainer} onEnter={removeFacebookAppendedHash} path="/">
      <Route onEnter={requireAuth}>
        <Route component={AdminResourcesPage} path="/admin-resources" />
        <Route component={UserReservationsPage} path="/my-reservations" />
      </Route>
      <IndexRoute component={HomePage} onEnter={scrollTop} />
      <Route component={AboutPage} onEnter={scrollTop} path="/about" />
      <Redirect from="/resources/:id/reservation" to="/resources/:id" />
      <Route component={ResourcePage} onEnter={scrollTop} path="/resources/:id" />
      <Route component={SearchPage} path="/search" />
      <Route component={NotFoundPage} path="*" />
    </Route>
  );
};
