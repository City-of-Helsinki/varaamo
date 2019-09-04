import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Route from '../app/shared/route/Route';
import PrivateRoute from '../app/shared/private-route/PrivateRoute';
import AppContainer from '../app/pages/AppContainer';
import AboutPage from '../app/pages/about/AboutPage';
import AdminResourcesPage from '../app/pages/admin-resources/AdminResourcesPage';
import HomePage from '../app/pages/home/HomePage';
import NotFoundPage from '../app/pages/not-found/NotFoundPage';
import ResourcePage from '../app/pages/resource/ResourcePage';
import UserReservationsPage from '../app/pages/user-reservations/UserReservationsPage';
import SearchPage from './domain/search/page/SearchPage';
import ManageReservationsPage from './domain/reservation/manage/page/ManageReservationsPage';
import ReservationPage from '../app/pages/reservation/ReservationPage';
import { RESERVATION_PHASE } from '../app/pages/reservation/constants';

export default () => (
  <AppContainer>
    <Switch>
      <Route component={HomePage} componentName="Home" exact path="/" />
      <Route component={SearchPage} componentName="Search" path="/search" />
      <Route component={AboutPage} componentName="About" path="/about" />
      <Route component={ResourcePage} componentName="Resource" path="/resources/:id" />

      <PrivateRoute
        component={AdminResourcesPage}
        componentName="AdminResources"
        path="/admin-resources"
      />
      <PrivateRoute
        component={ManageReservationsPage}
        componentName="ManageReservations"
        path="/manage-reservations"
      />
      <PrivateRoute
        component={UserReservationsPage}
        componentName="MyReservations"
        path="/my-reservations"
      />

      {/* <PrivateRoute
        component={ReservationNew}
        componentName="ReservationNew"
        path="/reservation/new"
      /> */}

      <PrivateRoute
        component={ReservationPage}
        componentName="ReservationPage"
        // eslint-disable-next-line max-len
        path={`/reservation/:reservationId/:reservationPhase(${RESERVATION_PHASE.INFORMATION}|${RESERVATION_PHASE.CONFIRMATION}|${RESERVATION_PHASE.EDIT})`}
      />

      <Redirect from="/home" to="/" />
      <Redirect from="/resources/:id/reservation" to="/resources/:id" />
      <Route component={NotFoundPage} componentName="NotFoundPage" path="*" />
    </Switch>
  </AppContainer>
);
