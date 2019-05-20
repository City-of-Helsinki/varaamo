import { availableHours, openingHoursMonth } from 'constants/ResourceConstants';

import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import * as timeUtils from 'utils/timeUtils';
import reservationCalendarSelector from './reservationCalendarSelector';

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
        selectedSlot: { foo: 'bar' },
        toEdit: ['mock-reservation'],
      },
    }),
  };
}

function getProps(id = 'some-id', date = '2015-10-10') {
  return {
    location: {
      search: `date=${date}&time=2015-10-10T12:00:00`,
      hash: '#some-hash',
    },
    params: {
      id,
    },
  };
}

describe('pages/resource/reservation-calendar/reservationCalendarSelector', () => {
  const resource = Resource.build({
    availableHours,
    slotSize: '01:00:00',
    openingHours: openingHoursMonth,
    reservations: [
      {
        begin: '2015-10-10T12:00:00+03:00',
        end: '2015-10-10T18:00:00+03:00',
        state: 'confirmed',
      },
    ],
  });

  test('returns date', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.date).toBeDefined();
  });

  test('returns isFetchingResource', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isFetchingResource).toBeDefined();
  });

  test('returns isAdmin', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isAdmin).toBeDefined();
  });

  test('returns isEditing based on reservationsToEdit', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);
    const expected = Boolean(state.ui.reservations.toEdit);

    expect(selected.isEditing).toBe(expected);
  });

  test('returns isLoggedIn', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isLoggedIn).toBeDefined();
  });

  test('returns isStaff', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isStaff).toBeDefined();
  });

  test('returns the reservation.selected from the state', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);
    const expected = state.ui.reservations.selected;

    expect(selected.selected).toBe(expected);
  });

  test('returns reservation.selectedSlot from state', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);
    expect(selected.selectedReservationSlot).toEqual(state.ui.reservations.selectedSlot);
  });

  test('returns resource', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.resource).toBeDefined();
  });

  test('returns time', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.time).toBeDefined();
  });

  describe('timeSlots', () => {
    test('uses resource properties to calculate correct time slots', () => {
      const mockSlots = ['slot-1', 'slot-2'];
      const expectedMockSlots = [
        mockSlots,
        mockSlots,
        mockSlots,
        mockSlots,
        mockSlots,
        mockSlots,
        mockSlots,
        mockSlots,
      ];
      simple.mock(timeUtils, 'getTimeSlots').returnWith(mockSlots);

      const state = getState(resource);
      const props = getProps(resource.id);
      const selected = reservationCalendarSelector(state, props);

      expect(timeUtils.getTimeSlots.callCount).toBe(8);
      const actualArgs = timeUtils.getTimeSlots.calls[5].args;
      expect(actualArgs[0]).toBe('2015-10-10T12:00:00+03:00');
      expect(actualArgs[1]).toBe('2015-10-10T18:00:00+03:00');
      expect(actualArgs[2]).toBe(resource.slotSize);
      expect(actualArgs[3]).toEqual(resource.reservations);
      expect(selected.timeSlots).toEqual(expectedMockSlots);
      simple.restore();
    });

    test('returns start day if resource is not open on that day', () => {
      const expectedMockSlots = [
        [],
        [],
        [],
        [],
        [],
        [{ start: '2015-10-10' }],
        [{ start: '2015-10-11' }],
        [],
      ];
      simple.mock(timeUtils, 'getTimeSlots').returnWith([]);

      const state = getState(resource);
      const props = getProps(resource.id);
      const selected = reservationCalendarSelector(state, props);

      expect(timeUtils.getTimeSlots.callCount).toBe(8);
      const actualArgs = timeUtils.getTimeSlots.calls[5].args;
      expect(actualArgs[0]).toBe('2015-10-10T12:00:00+03:00');
      expect(actualArgs[1]).toBe('2015-10-10T18:00:00+03:00');
      expect(actualArgs[2]).toBe(resource.slotSize);
      expect(actualArgs[3]).toEqual(resource.reservations);
      expect(selected.timeSlots).toEqual(expectedMockSlots);
      simple.restore();
    });

    test('returns timeSlots as an empty array when date not in resource', () => {
      const state = getState(resource);
      const props = getProps(resource.id, '2015-10-15');
      const selected = reservationCalendarSelector(state, props);

      expect(selected.timeSlots).toEqual([[], [], [], [], [], [], []]);
    });

    test('returns timeSlots as an empty array when resource is not found', () => {
      const state = getState(resource);
      const props = getProps('unfetched-resource-id');
      const selected = reservationCalendarSelector(state, props);

      expect(selected.timeSlots).toEqual([[]]);
    });
  });
});
