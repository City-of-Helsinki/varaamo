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
import ReservationEdit from '../app/pages/reservation/reservation-edit/ReservationEdit';

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

      {/* Reservation routes  */}
      <PrivateRoute
        component={ReservationNew}
        componentName="ReservationNew"
        path="/reservation/new"
      />

      <PrivateRoute
        component={ReservationEdit}
        componentName="ReservationEdit"
        path="/reservation/:reservationId/edit"
      />

      <PrivateRoute
        component={ReservationConfirm}
        componentName="ReservationConfirm"
        path="/reservation/:reservationId/confirm"
      />

      <PrivateRoute
        component={ReservationInfomationPage}
        componentName="ReservationInformationPage"
        path="/reservation/:reservationId/information"
      />
      {/* End of Reservation routes */}

      <Redirect from="/home" to="/" />
      <Redirect from="/resources/:id/reservation" to="/resources/:id" />
      <Route component={NotFoundPage} componentName="NotFoundPage" path="*" />
    </Switch>
  </AppContainer>
);
