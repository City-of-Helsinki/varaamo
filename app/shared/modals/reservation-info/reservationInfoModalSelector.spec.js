import { expect } from 'chai';

import ActionTypes from 'constants/ActionTypes';
import { getState } from 'utils/testUtils';
import reservationInfoModalSelector from './reservationInfoModalSelector';

describe('shared/modals/reservation-info/reservationInfoModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return reservationInfoModalSelector(state);
  }

  it('returns isAdmin', () => {
    expect(getSelected().isAdmin).to.exist;
  });

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

  it('returns isStaff', () => {
    expect(getSelected().isStaff).to.exist;
  });

  it('returns correct reservation from the state', () => {
    const reservation = { id: 'reservation-1' };
    const selected = getSelected({
      'ui.reservationInfoModal.reservation': reservation,
    });
    expect(selected.reservation).to.deep.equal(reservation);
  });

  it('returns correct resource from the state', () => {
    const resource = { id: 'resource-1' };
    const reservation = { id: 'reservation-1', resource: resource.id };
    const selected = getSelected({
      'data.resources': { [resource.id]: resource },
      'ui.reservationInfoModal.reservation': reservation,
    });

    expect(selected.resource).to.deep.equal(resource);
  });

  describe('show', () => {
    it('returns true if ui.reservationInfoModal.show is true', () => {
      const selected = getSelected({
        'ui.reservationInfoModal': { show: true },
      });
      expect(selected.show).to.be.true;
    });

    it('returns false if ui.reservationInfoModal.show is false', () => {
      const selected = getSelected({
        'ui.reservationInfoModal': { show: false },
      });
      expect(selected.show).to.be.false;
    });
  });
});
