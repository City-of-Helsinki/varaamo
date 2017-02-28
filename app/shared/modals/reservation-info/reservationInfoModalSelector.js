import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { createIsStaffSelector, isAdminSelector } from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

function reservationSelector(state) {
  return state.ui.reservations.toShow[0] || {};
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
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_INFO),
});

export default reservationInfoModalSelector;
