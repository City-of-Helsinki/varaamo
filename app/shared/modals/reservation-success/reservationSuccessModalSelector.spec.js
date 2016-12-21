import { expect } from 'chai';

import ModalTypes from 'constants/ModalTypes';
import { getState } from 'utils/testUtils';
import reservationSuccessModalSelector from './reservationSuccessModalSelector';

describe('shared/modals/reservation-success/reservationSuccessModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return reservationSuccessModalSelector(state);
  }

  it('returns reservationsToShow from the state', () => {
    const reservationsToShow = [{ id: 'r-1' }, { id: 'r-2' }];
    const selected = getSelected({
      'ui.reservations.toShow': reservationsToShow,
    });
    expect(selected.reservationsToShow).to.deep.equal(reservationsToShow);
  });

  it('returns resources from the state', () => {
    expect(getSelected().resources).to.exist;
  });

  describe('show', () => {
    it('returns true if modals.open contain RESERVATION_SUCCESS', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESERVATION_SUCCESS],
      });
      expect(selected.show).to.be.true;
    });

    it('returns false if modals.open does not contain RESERVATION_SUCCESS', () => {
      const selected = getSelected({
        'ui.modals.open': [],
      });
      expect(selected.show).to.be.false;
    });
  });

  it('returns user', () => {
    expect(getSelected().user).to.exist;
  });
});
