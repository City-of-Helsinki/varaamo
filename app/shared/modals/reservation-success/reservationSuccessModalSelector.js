import ModalTypes from 'constants/ModalTypes';

import orderBy from 'lodash/orderBy';
import { createStructuredSelector } from 'reselect';

import { currentUserSelector } from 'state/selectors/authSelectors';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';

const toShowSelector = state => orderBy(state.ui.reservations.toShow, 'begin');
const failedReservationsSelector = state => orderBy(state.ui.reservations.failed, 'begin');

const reservationSuccessModalSelector = createStructuredSelector({
  failedReservations: failedReservationsSelector,
  reservationsToShow: toShowSelector,
  resources: resourcesSelector,
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_SUCCESS),
  user: currentUserSelector,
});

export default reservationSuccessModalSelector;
