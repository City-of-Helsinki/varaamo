import { expect } from 'chai';

import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource, { openingHours } from 'fixtures/Resource';
import { reservationFormSelectors } from 'selectors/reservationFormSelectors';
import TimeUtils from 'utils/TimeUtils';

describe('Selectors: reservationFormSelectors', () => {
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
  let state;

  beforeEach(() => {
    state = {
      api: Immutable({
        isFetchingResource: false,
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
        reservation: {
          date: '2015-10-10',
          selected: ['mock-selected'],
        },
      }),
    };
  });

  describe('selected values', () => {
    it('should return the id in router.params.id', () => {
      const selected = reservationFormSelectors(state);
      const expected = state.router.params.id;

      expect(selected.id).to.equal(expected);
    });

    it('should return isFetchingResource from the state', () => {
      const selected = reservationFormSelectors(state);
      const expected = state.api.isFetchingResource;

      expect(selected.isFetchingResource).to.equal(expected);
    });

    it('should return the reservation date from the state', () => {
      const selected = reservationFormSelectors(state);
      const expected = state.ui.reservation.date;

      expect(selected.date).to.equal(expected);
    });

    it('should return the reservation.selected from the state', () => {
      const selected = reservationFormSelectors(state);
      const expected = state.ui.reservation.selected;

      expect(selected.selected).to.equal(expected);
    });

    describe('when resource is found from the state', () => {
      it('should return the resource corresponding to the router.params.id', () => {
        const selected = reservationFormSelectors(state);
        const resourceId = state.router.params.id;
        const expected = state.data.resources[resourceId];

        expect(selected.resource).to.deep.equal(expected);
      });

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
    });

    describe('when resource is not found from the state', () => {
      it('should return an empty object as resource', () => {
        state.router.params.id = 'unfetched-resource-id';
        const selected = reservationFormSelectors(state);

        expect(selected.resource).to.deep.equal({});
      });

      it('should return timeSlots as an empty array', () => {
        state.router.params.id = 'unfetched-resource-id';
        const selected = reservationFormSelectors(state);

        expect(selected.timeSlots).to.deep.equal([]);
      });
    });
  });
});
