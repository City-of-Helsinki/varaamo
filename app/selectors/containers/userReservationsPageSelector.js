import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import sortedReservationsSelector from 'selectors/sortedReservationsSelector';

const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

const userReservationsPageSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  resourcesSelector,
  sortedReservationsSelector,
  unitsSelector,
  (
    isFetchingReservations,
    resources,
    reservations,
    units
  ) => {
    return {
      isFetchingReservations,
      reservations,
      resources,
      units,
    };
  }
);

export default userReservationsPageSelector;
