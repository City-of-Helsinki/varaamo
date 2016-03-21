import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import isAdminSelector from 'selectors/isAdminSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import sortedReservationsSelector from 'selectors/sortedReservationsSelector';

const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

const reservationsListSelector = createSelector(
  isAdminSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  resourcesSelector,
  sortedReservationsSelector,
  unitsSelector,
  (
    isAdmin,
    isFetchingReservations,
    resources,
    reservations,
    units
  ) => {
    return {
      isAdmin,
      isFetchingReservations,
      reservations,
      resources,
      units,
    };
  }
);

export default reservationsListSelector;
