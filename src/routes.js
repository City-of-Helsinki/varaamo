import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Route from '../app/shared/route/Route';
import PrivateRoute from '../app/shared/private-route/PrivateRoute';
import AppContainer from '../app/pages/AppContainer';
import AdminResourcesPage from '../app/pages/admin-resources/AdminResourcesPage';
import NotFoundPage from '../app/pages/not-found/NotFoundPage';
import ReservationPage from '../app/pages/reservation/ReservationPage';
import ReservationPaymentReturnPage from '../app/pages/reservation/ReservationPaymentReturnPage';
import ResourcePage from '../app/pages/resource/ResourcePage';
import UserReservationsPage from '../app/pages/user-reservations/UserReservationsPage';
import SearchPage from './domain/search/page/SearchPage';
import AboutPage from './domain/about/AboutPage';
import ManageReservationsPage from './domain/reservation/manage/page/ManageReservationsPage';
import HomePage from './domain/home/HomePage';
import CreateNotifications from './common/notificator/create/CreateNotifications';

export default () => (
  <AppContainer>
    <Switch>
      <Route component={HomePage} componentName="Home" exact path="/" />
      <Route component={SearchPage} componentName="Search" path="/search" />
      <Route component={AboutPage} componentName="About" path="/about" />
      <Route
        component={ResourcePage}
        componentName="Resource"
        path="/resources/:id"
      />

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
      <PrivateRoute
        component={ReservationPage}
        componentName="Reservation"
        path="/reservation"
      />
      <PrivateRoute
        component={ReservationPaymentReturnPage}
        componentName="ReservationPaymentReturn"
        path="/reservation-payment-return"
      />
      <PrivateRoute
        component={CreateNotifications}
        componentName="CreateNotifications"
        path="/create-notifications"
      />

      <Redirect from="/home" to="/" />
      <Redirect from="/resources/:id/reservation" to="/resources/:id" />
      <Route component={NotFoundPage} componentName="NotFoundPage" path="*" />
    </Switch>
  </AppContainer>
);
