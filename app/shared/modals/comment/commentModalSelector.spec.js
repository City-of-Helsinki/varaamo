
import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

import { getState } from 'utils/testUtils';
import commentModalSelector from './commentModalSelector';

describe('shared/modals/comment/commentModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return commentModalSelector(state);
  }

  describe('isSaving', () => {
    test('returns true if RESERVATION_PUT_REQUEST is active', () => {
      const activeRequests = { [ActionTypes.API.RESERVATION_PUT_REQUEST]: 1 };
      const selected = getSelected({
        'api.activeRequests': activeRequests,
      });
      expect(selected.isSaving).toBe(true);
    });

    test('returns false if RESERVATION_PUT_REQUEST is not active', () => {
      expect(getSelected().isSaving).toBe(false);
    });
  });

  test('returns correct reservation from the state', () => {
    const reservation = { id: 'reservation-1' };
    const selected = getSelected({
      'ui.reservations.toShow': [reservation],
    });
    expect(selected.reservation).toEqual(reservation);
  });

  test('returns correct resource from the state', () => {
    const resource = { id: 'resource-1' };
    const reservation = { id: 'reservation-1', resource: resource.id };
    const selected = getSelected({
      'data.resources': { [resource.id]: resource },
      'ui.reservations.toShow': [reservation],
    });

    expect(selected.resource).toEqual(resource);
  });

  describe('show', () => {
    test('returns true if modals.open contain RESERVATION_COMMENT', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESERVATION_COMMENT],
      });
      expect(selected.show).toBe(true);
    });

    test(
      'returns false if modals.open does not contain RESERVATION_COMMENT',
      () => {
        const selected = getSelected({
          'ui.modals.open': [],
        });
        expect(selected.show).toBe(false);
      }
    );
  });
});
