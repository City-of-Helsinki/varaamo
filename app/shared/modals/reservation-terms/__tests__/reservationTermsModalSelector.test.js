import ModalTypes from '../../../../constants/ModalTypes';
import { getState } from '../../../../utils/testUtils';
import reservationTermsModalSelector from '../reservationTermsModalSelector';

describe('shared/modals/reservation-terms/reservationTermsModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return reservationTermsModalSelector(state);
  }

  describe('show', () => {
    test('returns true if modals.open contain RESOURCE_TERMS', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESOURCE_TERMS],
      });
      expect(selected.show).toBe(true);
    });

    test('returns false if modals.open does not contain RESOURCE_TERMS', () => {
      const selected = getSelected({
        'ui.modals.open': [],
      });
      expect(selected.show).toBe(false);
    });
  });
});
