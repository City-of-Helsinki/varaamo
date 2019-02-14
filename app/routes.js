import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Route from 'shared/route';
import PrivateRoute from 'shared/private-route';
import AppContainer from 'pages/AppContainer';
import AboutPage from 'pages/about';
import AdminResourcesPage from 'pages/admin-resources';
import HomePage from 'pages/home';
import NotFoundPage from 'pages/not-found';
import ReservationPage from 'pages/reservation';
import ResourcePage from 'pages/resource';
import SearchPage from 'pages/search';
import UserReservationsPage from 'pages/user-reservations';

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
        component={UserReservationsPage}
        componentName="MyReservations"
        path="/my-reservations"
      />
      <PrivateRoute component={ReservationPage} componentName="Reservation" path="/reservation" />

      <Redirect from="/home" to="/" />
      <Redirect from="/resources/:id/reservation" to="/resources/:id" />
      <Route component={NotFoundPage} componentName="NotFoundPage" path="*" />
    </Switch>
  </AppContainer>
);
