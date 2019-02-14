
import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

import { createSelector, createStructuredSelector } from 'reselect';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

function reservationSelector(state) {
  return state.ui.reservations.toShow[0] || {};
}

const resourceIdSelector = createSelector(
  reservationSelector,
  reservation => reservation.resource,
);

const commentModalSelector = createStructuredSelector({
  isSaving: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  reservation: reservationSelector,
  resource: createResourceSelector(resourceIdSelector),
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_COMMENT)
});

export default commentModalSelector;
