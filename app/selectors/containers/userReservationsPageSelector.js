import _ from 'lodash';
import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const reservationsSelector = (state) => state.data.reservations;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

const userReservationsPageSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  reservationsSelector,
  resourcesSelector,
  unitsSelector,
  (
    isFetchingReservations,
    reservations,
    resources,
    units
  ) => {
    return {
      isFetchingReservations,
      reservations: _.values(reservations),
      resources,
      units,
    };
  }
);

export default userReservationsPageSelector;
