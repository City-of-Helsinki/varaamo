import { expect } from 'chai';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Resource, { openingHours } from 'fixtures/Resource';
import reservationCalendarSelector from 'selectors/containers/reservationCalendarSelector';
import TimeUtils from 'utils/TimeUtils';

function getState(resource) {
  return {
    api: Immutable({
      activeRequests: [],
    }),
    auth: {
      token: null,
      userId: null,
    },
    data: Immutable({
      resources: { [resource.id]: resource },
      users: {},
    }),
    ui: Immutable({
      modals: {
        open: [],
      },
      reservations: {
        selected: [],
        toEdit: ['mock-reservation'],
      },
    }),
  };
}

function getProps(id = 'some-id') {
  return {
    location: {
      query: {
        date: '2015-10-10',
        time: '2015-10-10T12:00:00+03:00',
      },
      hash: '#some-hash',
    },
    params: {
      id,
    },
  };
}


describe('Selector: reservationCalendarSelector', () => {
  const resource = Resource.build({
    minPeriod: '01:00:00',
    openingHours,
    reservations: [
      {
        opens: '2015-10-10T12:00:00+03:00',
        closes: '2015-10-10T18:00:00+03:00',
        state: 'confirmed',
      },
    ],
  });

  it('should return confirmReservationModalIsOpen', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.confirmReservationModalIsOpen).to.exist;
  });

  it('should return date', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.date).to.exist;
  });

  it('should return the id in router.params.id', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);
    const expected = props.params.id;

    expect(selected.id).to.equal(expected);
  });

  it('should return isFetchingResource', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isFetchingResource).to.exist;
  });

  it('should return isLoggedIn', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isLoggedIn).to.exist;
  });

  it('should return isMakingReservations', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isMakingReservations).to.exist;
  });

  it('should return reservationsToEdit from the state', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);
    const expected = state.ui.reservations.toEdit;

    expect(selected.reservationsToEdit).to.deep.equal(expected);
  });

  it('should return the reservation.selected from the state', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);
    const expected = state.ui.reservations.selected;

    expect(selected.selected).to.equal(expected);
  });

  it('should return resource', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.resource).to.exist;
  });

  it('should return selectedReservations', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.selectedReservations).to.exist;
  });

  it('should return staffUnits', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.staffUnits).to.exist;
  });

  it('should return time', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.time).to.exist;
  });

  describe('timeSlots', () => {
    it('should use resource properties to calculate correct time slots', () => {
      const mockSlots = ['slot-1', 'slot-2'];
      simple.mock(TimeUtils, 'getTimeSlots').returnWith(mockSlots);

      const state = getState(resource);
      const props = getProps(resource.id);
      const selected = reservationCalendarSelector(state, props);
      const actualArgs = TimeUtils.getTimeSlots.lastCall.args;

      expect(actualArgs[0]).to.equal(resource.openingHours[0].opens);
      expect(actualArgs[1]).to.equal(resource.openingHours[0].closes);
      expect(actualArgs[2]).to.equal(resource.minPeriod);
      expect(actualArgs[3]).to.deep.equal(resource.reservations);
      expect(selected.timeSlots).to.deep.equal(mockSlots);
      simple.restore();
    });

    it('should return timeSlots as an empty array when resource is not found', () => {
      const state = getState(resource);
      const props = getProps('unfetched-resource-id');
      const selected = reservationCalendarSelector(state, props);

      expect(selected.timeSlots).to.deep.equal([]);
    });
  });

  it('should return urlHash', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const expected = props.location.hash;
    const selected = reservationCalendarSelector(state, props);

    expect(selected.urlHash).to.equal(expected);
  });
});
