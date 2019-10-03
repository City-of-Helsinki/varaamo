import { createStructuredSelector } from 'reselect';

import ActionTypes from '../../../constants/ActionTypes';
import { isAdminSelector } from '../../../state/selectors/authSelectors';
import { resourcesSelector, unitsSelector } from '../../../state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from '../../../state/selectors/factories/requestIsActiveSelectorFactory';
import sortedReservationsSelector from '../../../state/selectors/sortedReservationsSelector';

const reservationListSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isFetchingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  reservations: sortedReservationsSelector,
  resources: resourcesSelector,
  units: unitsSelector,
});

export default reservationListSelector;
