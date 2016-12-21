import { createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import isAdminSelector from 'state/selectors/isAdminSelector';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const toCancelSelector = state => state.ui.reservations.toCancel;

const reservationCancelModalSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isCancellingReservations: requestIsActiveSelectorFactory(
    ActionTypes.API.RESERVATION_DELETE_REQUEST
  ),
  reservationsToCancel: toCancelSelector,
  resources: resourcesSelector,
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CANCEL),
});

export default reservationCancelModalSelector;
