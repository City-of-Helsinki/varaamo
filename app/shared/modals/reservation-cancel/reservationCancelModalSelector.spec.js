import { expect } from 'chai';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { getState } from 'utils/testUtils';
import reservationCancelModalSelector from './reservationCancelModalSelector';

describe('shared/modals/reservation-cancel/reservationCancelModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return reservationCancelModalSelector(state);
  }

  describe('cancelAllowed', () => {
    it('returns true if user is an admin', () => {
      const selected = getSelected({
        auth: { userId: 'u-1' },
        'data.users': { 'u-1': { isStaff: true } },
      });
      expect(selected.cancelAllowed).to.be.true;
    });

    it('returns true if reservation is not preliminary', () => {
      const reservation = { id: 'reservation-1', needManualConfirmation: false };
      const selected = getSelected({
        'ui.reservations.toCancel': [reservation],
      });
      expect(selected.cancelAllowed).to.be.true;
    });

    it('returns true if reservation state is not confirmed', () => {
      const reservation = { id: 'reservation-1', state: 'requested' };
      const selected = getSelected({
        'ui.reservations.toCancel': [reservation],
      });
      expect(selected.cancelAllowed).to.be.true;
    });

    it('returns false if user is not admin and reservation is confirmed and preliminary', () => {
      const reservation = {
        id: 'reservation-1',
        needManualConfirmation: true,
        state: 'confirmed',
      };
      const selected = getSelected({
        'ui.reservations.toCancel': [reservation],
      });
      expect(selected.cancelAllowed).to.be.false;
    });
  });

  describe('isCancellingReservations', () => {
    it('returns true if RESERVATION_DELETE_REQUEST is active', () => {
      const activeRequests = { [ActionTypes.API.RESERVATION_DELETE_REQUEST]: 1 };
      const selected = getSelected({
        'api.activeRequests': activeRequests,
      });
      expect(selected.isCancellingReservations).to.be.true;
    });

    it('returns false if RESERVATION_DELETE_REQUEST is not active', () => {
      expect(getSelected().isCancellingReservations).to.be.false;
    });
  });

  it('returns correct reservation from the state', () => {
    const reservation = { id: 'reservation-1' };
    const selected = getSelected({
      'ui.reservations.toCancel': [reservation],
    });
    expect(selected.reservation).to.deep.equal(reservation);
  });

  it('returns correct resource from the state', () => {
    const resource = { id: 'resource-1' };
    const reservation = { id: 'reservation-1', resource: resource.id };
    const selected = getSelected({
      'data.resources': { [resource.id]: resource },
      'ui.reservations.toCancel': [reservation],
    });

    expect(selected.resource).to.deep.equal(resource);
  });

  describe('show', () => {
    it('returns true if modals.open contain RESERVATION_CANCEL', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESERVATION_CANCEL],
      });
      expect(selected.show).to.be.true;
    });

    it('returns false if modals.open does not contain RESERVATION_CANCEL', () => {
      const selected = getSelected({
        'ui.modals.open': [],
      });
      expect(selected.show).to.be.false;
    });
  });
});
