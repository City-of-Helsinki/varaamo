import includes from 'lodash/collection/includes';
import { createSelector } from 'reselect';

const modalIsOpenSelectorFactory = (modalType) => {
  const openModalsSelector = (state) => state.ui.modals.open;

  return createSelector(
    openModalsSelector,
    (openModals) => {
      return includes(openModals, modalType);
    }
  );
};

export default modalIsOpenSelectorFactory;
