import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Route from '../app/shared/route/Route';
import PrivateRoute from '../app/shared/private-route/PrivateRoute';
import AppContainer from '../app/pages/AppContainer';
import AboutPage from '../app/pages/about/AboutPage';
import AdminResourcesPage from '../app/pages/admin-resources/AdminResourcesPage';
import HomePage from '../app/pages/home/HomePage';
import NotFoundPage from '../app/pages/not-found/NotFoundPage';
import ReservationPaymentReturnPage from '../app/pages/reservation/ReservationPaymentReturnPage';
import ResourcePage from '../app/pages/resource/ResourcePage';
import UserReservationsPage from '../app/pages/user-reservations/UserReservationsPage';
import SearchPage from './domain/search/page/SearchPage';
import ManageReservationsPage from './domain/reservation/manage/page/ManageReservationsPage';
import ReservationEditPage from './domain/reservation/edit/page/ReservationEditPage';

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
      <PrivateRoute
        component={ReservationEditPage}
        componentName="ReservationEditPage"
        path="/reservation/:reservationId"
      />
      <PrivateRoute
        component={ReservationPaymentReturnPage}
        componentName="ReservationPaymentReturn"
        path="/reservation-payment-return"
      />

      <Redirect from="/home" to="/" />
      <Redirect from="/resources/:id/reservation" to="/resources/:id" />
      <Route component={NotFoundPage} componentName="NotFoundPage" path="*" />
    </Switch>
  </AppContainer>
);
