import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { createIsStaffSelector, isAdminSelector } from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

function reservationSelector(state) {
  return state.ui.reservationInfoModal.reservation || {};
}

const resourceIdSelector = createSelector(
  reservationSelector,
  reservation => reservation.resource
);

const resourceSelector = createResourceSelector(resourceIdSelector);

const reservationInfoModalSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isEditingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  isStaff: createIsStaffSelector(resourceSelector),
  reservation: reservationSelector,
  resource: resourceSelector,
  show: state => state.ui.reservationInfoModal.show,
});

export default reservationInfoModalSelector;
