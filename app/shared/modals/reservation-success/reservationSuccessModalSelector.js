import { createStructuredSelector } from 'reselect';

import ModalTypes from 'constants/ModalTypes';
import currentUserSelector from 'state/selectors/currentUserSelector';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';

const resourcesSelector = state => state.data.resources;
const toShowSelector = state => state.ui.reservations.toShow;

const reservationSuccessModalSelector = createStructuredSelector({
  reservationsToShow: toShowSelector,
  resources: resourcesSelector,
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_SUCCESS),
  user: currentUserSelector,
});

export default reservationSuccessModalSelector;
