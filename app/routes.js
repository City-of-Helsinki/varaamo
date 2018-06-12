import React from 'react';
import { IndexRoute, Redirect, Route } from 'react-router';
import { createAction } from 'redux-actions';

import AppContainer from 'pages/AppContainer';
import AboutPage from 'pages/about';
import AdminResourcesPage from 'pages/admin-resources';
import HomePage from 'pages/home';
import NotFoundPage from 'pages/not-found';
import ReservationPage from 'pages/reservation';
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

  function scrollTop() {
    window.scrollTo(0, 0);
  }

  function getDispatchers(componentName, { onChange = () => {}, onEnter = () => {} } = {}) {
    const routeChangedAction = createAction(`ENTER_OR_CHANGE_${componentName.toUpperCase()}_PAGE`);

    function onChangeFunc(prevState, nextState, replace, callback) {
      params.dispatch(routeChangedAction(nextState.location));
      onChange(nextState, replace, callback);
      callback();
    }

    function onEnterFunc(nextState, replace, callback) {
      params.dispatch(routeChangedAction(nextState.location));
      onEnter(nextState, replace, callback);
      callback();
    }

    return { onChange: onChangeFunc, onEnter: onEnterFunc };
  }

  return (
    <Route component={AppContainer} onEnter={removeFacebookAppendedHash} path="/">
      <Route onEnter={requireAuth}>
        <Route
          {...getDispatchers('AdminResources')}
          component={AdminResourcesPage}
          path="/admin-resources"
        />
        <Route
          {...getDispatchers('MyReservations')}
          component={UserReservationsPage}
          path="/my-reservations"
        />
        <Route
          {...getDispatchers('Reservation')}
          component={ReservationPage}
          path="/reservation"
        />
      </Route>
      <IndexRoute component={HomePage} {...getDispatchers('Home')} />
      <Redirect from="/home" to="/" />
      <Route component={SearchPage} {...getDispatchers('Search')} path="/search" />
      <Route component={AboutPage} {...getDispatchers('About', { onEnter: scrollTop })} path="/about" />
      <Redirect from="/resources/:id/reservation" to="/resources/:id" />
      <Route
        {...getDispatchers('Resource', { onEnter: scrollTop })}
        component={ResourcePage}
        path="/resources/:id"
      />
      <Route component={NotFoundPage} {...getDispatchers('NotFoundPage')} path="*" />
    </Route>
  );
};
