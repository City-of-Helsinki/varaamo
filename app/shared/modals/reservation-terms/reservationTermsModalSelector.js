import ModalTypes from 'constants/ModalTypes';

import { createStructuredSelector } from 'reselect';

import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';

const reservationTermsModalSelector = createStructuredSelector({
  show: modalIsOpenSelectorFactory(ModalTypes.RESOURCE_TERMS),
});

export default reservationTermsModalSelector;
