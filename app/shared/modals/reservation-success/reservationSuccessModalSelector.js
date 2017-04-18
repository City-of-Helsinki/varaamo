import { createStructuredSelector } from 'reselect';

import ModalTypes from 'constants/ModalTypes';
import { currentUserSelector } from 'state/selectors/authSelectors';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';

const toShowSelector = state => state.ui.reservations.toShow;
const failedReservationsSelector = state => state.ui.reservations.failed;

const reservationSuccessModalSelector = createStructuredSelector({
  failedReservations: failedReservationsSelector,
  reservationsToShow: toShowSelector,
  resources: resourcesSelector,
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_SUCCESS),
  user: currentUserSelector,
});

export default reservationSuccessModalSelector;
