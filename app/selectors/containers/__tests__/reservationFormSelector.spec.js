import { expect } from 'chai';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Resource, { openingHours } from 'fixtures/Resource';
import reservationFormSelector from 'selectors/containers/reservationFormSelector';
import TimeUtils from 'utils/TimeUtils';

function getState(resource, resourceId) {
  const id = resourceId || resource.id;

  return {
    api: Immutable({
      activeRequests: [],
    }),
    data: Immutable({
      resources: { [resource.id]: resource },
    }),
    router: {
      location: {
        query: {
          date: '2015-10-10',
          time: '2015-10-10T12:00:00+03:00',
        },
      },
      params: {
        id,
      },
    },
    ui: Immutable({
      modals: {
        open: [],
      },
      reservation: {
        selected: [],
        toEdit: ['mock-reservation'],
      },
    }),
  };
}

describe('Selector: reservationFormSelector', () => {
  const resource = Resource.build({
    minPeriod: '01:00:00',
    openingHours,
    reservations: [
      {
        opens: '2015-10-10T12:00:00+03:00',
        closes: '2015-10-10T18:00:00+03:00',
      },
    ],
  });

  it('should return confirmReservationModalIsOpen', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);

    expect(selected.confirmReservationModalIsOpen).to.exist;
  });

  it('should return date', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);

    expect(selected.date).to.exist;
  });

  it('should return the id in router.params.id', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);
    const expected = state.router.params.id;

    expect(selected.id).to.equal(expected);
  });

  it('should return isFetchingResource', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);

    expect(selected.isFetchingResource).to.exist;
  });

  it('should return isMakingReservations', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);

    expect(selected.isMakingReservations).to.exist;
  });

  it('should return reservationsToEdit from the state', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);
    const expected = state.ui.reservation.toEdit;

    expect(selected.reservationsToEdit).to.deep.equal(expected);
  });

  it('should return the reservation.selected from the state', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);
    const expected = state.ui.reservation.selected;

    expect(selected.selected).to.equal(expected);
  });

  it('should return selectedReservations', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);

    expect(selected.selectedReservations).to.exist;
  });

  it('should return time', () => {
    const state = getState(resource);
    const selected = reservationFormSelector(state);

    expect(selected.time).to.exist;
  });


  describe('timeSlots', () => {
    it('should use resource properties to calculate correct time slots', () => {
      const mockSlots = ['slot-1', 'slot-2'];
      simple.mock(TimeUtils, 'getTimeSlots').returnWith(mockSlots);

      const state = getState(resource);
      const selected = reservationFormSelector(state);
      const actualArgs = TimeUtils.getTimeSlots.lastCall.args;

      expect(actualArgs[0]).to.equal(resource.openingHours[0].opens);
      expect(actualArgs[1]).to.equal(resource.openingHours[0].closes);
      expect(actualArgs[2]).to.equal(resource.minPeriod);
      expect(actualArgs[3]).to.deep.equal(resource.reservations);
      expect(selected.timeSlots).to.deep.equal(mockSlots);
      simple.restore();
    });

    it('should return timeSlots as an empty array when resource is not found', () => {
      const state = getState(resource, 'unfetched-resource-id');
      const selected = reservationFormSelector(state);

      expect(selected.timeSlots).to.deep.equal([]);
    });
  });
});
