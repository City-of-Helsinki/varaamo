import { expect } from 'chai';

import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import Resource, { openingHours } from 'fixtures/Resource';
import { reservationFormSelectors } from 'selectors/reservationFormSelectors';
import TimeUtils from 'utils/TimeUtils';

describe('Selectors: reservationFormSelectors', () => {
  let resource;
  let state;

  beforeEach(() => {
    resource = Resource.build({
      minPeriod: '01:00:00',
      openingHours,
      reservations: [
        {
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
        },
      ],
    });

    state = {
      api: Immutable({
        activeRequests: [],
        pendingReservationsCount: 0,
      }),
      data: Immutable({
        resources: { [resource.id]: resource },
      }),
      router: {
        params: {
          id: resource.id,
        },
      },
      ui: Immutable({
        modals: {
          open: [],
        },
        reservation: {
          date: '2015-10-10',
          selected: [],
        },
      }),
    };
  });

  describe('confirmReservationModalIsOpen', () => {
    it('should return true if "CONFIRM_RESERVATION" is in open modals', () => {
      state.ui.modals.open = [ModalTypes.CONFIRM_RESERVATION];
      const selected = reservationFormSelectors(state);

      expect(selected.confirmReservationModalIsOpen).to.equal(true);
    });

    it('should return false if "CONFIRM_RESERVATION" is not in open modals', () => {
      const selected = reservationFormSelectors(state);

      expect(selected.confirmReservationModalIsOpen).to.equal(false);
    });
  });

  it('should return date', () => {
    const selected = reservationFormSelectors(state);

    expect(selected.date).to.exist;
  });

  it('should return the id in router.params.id', () => {
    const selected = reservationFormSelectors(state);
    const expected = state.router.params.id;

    expect(selected.id).to.equal(expected);
  });

  describe('isFetchingResource', () => {
    it('should return true if RESOURCE_GET_REQUEST is in activeRequests', () => {
      state.api.activeRequests = [types.API.RESOURCE_GET_REQUEST];
      const selected = reservationFormSelectors(state);

      expect(selected.isFetchingResource).to.equal(true);
    });

    it('should return false if RESOURCE_GET_REQUEST is not in activeRequests', () => {
      const selected = reservationFormSelectors(state);

      expect(selected.isFetchingResource).to.equal(false);
    });
  });

  describe('isMakingReservations', () => {
    it('should be false if pendingReservationsCount is 0', () => {
      const selected = reservationFormSelectors(state);

      expect(selected.isMakingReservations).to.equal(false);
    });

    it('should be true if pendingReservationsCount is more than 0', () => {
      state.api.pendingReservationsCount = 1;
      const selected = reservationFormSelectors(state);

      expect(selected.isMakingReservations).to.equal(true);
    });
  });

  it('should return the reservation.selected from the state', () => {
    const selected = reservationFormSelectors(state);
    const expected = state.ui.reservation.selected;

    expect(selected.selected).to.equal(expected);
  });

  it('should return selectedReservations', () => {
    const selected = reservationFormSelectors(state);

    expect(selected.selectedReservations).to.exist;
  });

  describe('timeSlots', () => {
    it('should use resource properties to calculate correct time slots', () => {
      const mockSlots = ['slot-1', 'slot-2'];
      simple.mock(TimeUtils, 'getTimeSlots').returnWith(mockSlots);
      const selected = reservationFormSelectors(state);
      const actualArgs = TimeUtils.getTimeSlots.lastCall.args;

      expect(actualArgs[0]).to.equal(resource.openingHours[0].opens);
      expect(actualArgs[1]).to.equal(resource.openingHours[0].closes);
      expect(actualArgs[2]).to.equal(resource.minPeriod);
      expect(actualArgs[3]).to.deep.equal(resource.reservations);
      expect(selected.timeSlots).to.deep.equal(mockSlots);
      simple.restore();
    });

    it('should return timeSlots as an empty array when resource is not found', () => {
      state.router.params.id = 'unfetched-resource-id';
      const selected = reservationFormSelectors(state);

      expect(selected.timeSlots).to.deep.equal([]);
    });
  });
});
