import includes from 'lodash/includes';
import { createSelector } from 'reselect';

const modalIsOpenSelectorFactory = (modalType) => {
  const openModalsSelector = state => state.ui.modals.open;

  return createSelector(
    openModalsSelector,
    openModals => includes(openModals, modalType)
  );
};

export default modalIsOpenSelectorFactory;
