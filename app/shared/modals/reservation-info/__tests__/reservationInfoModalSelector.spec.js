import mockDate from 'mockdate';

import ActionTypes from '../../../../constants/ActionTypes';
import { getState } from '../../../../utils/testUtils';
import reservationInfoModalSelector from '../reservationInfoModalSelector';

describe('shared/modals/reservation-info/reservationInfoModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return reservationInfoModalSelector(state);
  }

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).toBeDefined();
  });

  describe('isEditing', () => {
    test('returns true if ui.reservationInfoModal.isEditing is true', () => {
      const selected = getSelected({
        'ui.reservationInfoModal': { isEditing: true },
      });
      expect(selected.isEditing).toBe(true);
    });

    test('returns false if ui.reservationInfoModal.isEditing is false', () => {
      const selected = getSelected({
        'ui.reservationInfoModal': { isEditing: false },
      });
      expect(selected.isEditing).toBe(false);
    });
  });

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

  test('returns isStaff', () => {
    expect(getSelected().isStaff).toBeDefined();
  });

  test('returns correct reservation from the state', () => {
    const reservation = { id: 'reservation-1' };
    const selected = getSelected({
      'ui.reservationInfoModal.reservation': reservation,
    });
    expect(selected.reservation).toEqual(reservation);
  });

  describe('reservationIsEditable', () => {
    beforeAll(() => {
      mockDate.set('2017-03-01T10:00:00Z');
    });

    afterAll(() => {
      mockDate.reset();
    });

    test('returns false if reservation is in the past', () => {
      const reservation = { end: '2016-12-12T10:00:00Z' };
      const selected = getSelected({
        'ui.reservationInfoModal.reservation': reservation,
      });
      expect(selected.reservationIsEditable).toBe(false);
    });

    test('returns false if reservation is cancelled', () => {
      const reservation = { end: '2017-12-12T10:00:00Z', state: 'cancelled' };
      const selected = getSelected({
        'ui.reservationInfoModal.reservation': reservation,
      });
      expect(selected.reservationIsEditable).toBe(false);
    });

    test('returns true otherwise', () => {
      const reservation = { end: '2017-12-12T10:00:00Z', state: 'confirmed' };
      const selected = getSelected({
        'ui.reservationInfoModal.reservation': reservation,
      });
      expect(selected.reservationIsEditable).toBe(true);
    });
  });

  test('returns correct resource from the state', () => {
    const resource = { id: 'resource-1' };
    const reservation = { id: 'reservation-1', resource: resource.id };
    const selected = getSelected({
      'data.resources': { [resource.id]: resource },
      'ui.reservationInfoModal.reservation': reservation,
    });

    expect(selected.resource).toEqual(resource);
  });

  describe('show', () => {
    test('returns true if ui.reservationInfoModal.show is true', () => {
      const selected = getSelected({
        'ui.reservationInfoModal': { show: true },
      });
      expect(selected.show).toBe(true);
    });

    test('returns false if ui.reservationInfoModal.show is false', () => {
      const selected = getSelected({
        'ui.reservationInfoModal': { show: false },
      });
      expect(selected.show).toBe(false);
    });
  });
});
