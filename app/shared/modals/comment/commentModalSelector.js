import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

function reservationSelector(state) {
  return state.ui.reservations.toShow[0] || {};
}

const resourceSelector = createSelector(
  reservationSelector,
  resourcesSelector,
  (reservation, resources) => resources[reservation.resource] || {}
);

const commentModalSelector = createStructuredSelector({
  isEditingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  reservation: reservationSelector,
  resource: resourceSelector,
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_COMMENT),
});

export default commentModalSelector;
