import { expect } from 'chai';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { getState } from 'utils/testUtils';
import commentModalSelector from './commentModalSelector';

describe('shared/modals/comment/commentModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return commentModalSelector(state);
  }

  describe('isEditingReservations', () => {
    it('returns true if RESERVATION_PUT_REQUEST is active', () => {
      const activeRequests = { [ActionTypes.API.RESERVATION_PUT_REQUEST]: 1 };
      const selected = getSelected({
        'api.activeRequests': activeRequests,
      });
      expect(selected.isEditingReservations).to.be.true;
    });

    it('returns false if RESERVATION_PUT_REQUEST is not active', () => {
      expect(getSelected().isEditingReservations).to.be.false;
    });
  });

  it('returns correct reservation from the state', () => {
    const reservation = { id: 'reservation-1' };
    const selected = getSelected({
      'ui.reservations.toShow': [reservation],
    });
    expect(selected.reservation).to.deep.equal(reservation);
  });

  it('returns correct resource from the state', () => {
    const resource = { id: 'resource-1' };
    const reservation = { id: 'reservation-1', resource: resource.id };
    const selected = getSelected({
      'data.resources': { [resource.id]: resource },
      'ui.reservations.toShow': [reservation],
    });

    expect(selected.resource).to.deep.equal(resource);
  });

  describe('show', () => {
    it('returns true if modals.open contain RESERVATION_COMMENT', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESERVATION_COMMENT],
      });
      expect(selected.show).to.be.true;
    });

    it('returns false if modals.open does not contain RESERVATION_COMMENT', () => {
      const selected = getSelected({
        'ui.modals.open': [],
      });
      expect(selected.show).to.be.false;
    });
  });
});
