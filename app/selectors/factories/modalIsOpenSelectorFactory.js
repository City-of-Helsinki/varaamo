import _ from 'lodash';
import { createSelector } from 'reselect';

const modalIsOpenSelectorFactory = (modalType) => {
  const openModalsSelector = (state) => state.ui.modals.open;

  return createSelector(
    openModalsSelector,
    (openModals) => {
      return _.includes(openModals, modalType);
    }
  );
};

export default modalIsOpenSelectorFactory;
