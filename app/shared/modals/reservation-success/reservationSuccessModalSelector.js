import { createStructuredSelector } from 'reselect';

import ModalTypes from 'constants/ModalTypes';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import currentUserSelector from 'state/selectors/currentUserSelector';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';

const toShowSelector = state => state.ui.reservations.toShow;

const reservationSuccessModalSelector = createStructuredSelector({
  reservationsToShow: toShowSelector,
  resources: resourcesSelector,
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_SUCCESS),
  user: currentUserSelector,
});

export default reservationSuccessModalSelector;
