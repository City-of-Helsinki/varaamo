import { createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { resourcesSelector, unitsSelector } from 'state/selectors/dataSelectors';
import isAdminSelector from 'state/selectors/isAdminSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import sortedReservationsSelector from 'state/selectors/sortedReservationsSelector';
import staffUnitsSelector from 'state/selectors/staffUnitsSelector';

const reservationListSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isFetchingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  reservations: sortedReservationsSelector,
  resources: resourcesSelector,
  staffUnits: staffUnitsSelector,
  units: unitsSelector,
});

export default reservationListSelector;
