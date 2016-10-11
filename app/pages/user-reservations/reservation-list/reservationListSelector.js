import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import isAdminSelector from 'selectors/isAdminSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import sortedReservationsSelector from 'selectors/sortedReservationsSelector';
import staffUnitsSelector from 'selectors/staffUnitsSelector';

const resourcesSelector = state => state.data.resources;
const unitsSelector = state => state.data.units;

const reservationListSelector = createSelector(
  isAdminSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  resourcesSelector,
  sortedReservationsSelector,
  staffUnitsSelector,
  unitsSelector,
  (
    isAdmin,
    isFetchingReservations,
    resources,
    reservations,
    staffUnits,
    units
  ) => ({
    isAdmin,
    isFetchingReservations,
    reservations,
    resources,
    staffUnits,
    units,
  })
);

export default reservationListSelector;
