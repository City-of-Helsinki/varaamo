import { slotSize } from 'constants/SlotConstants';

import mockDate from 'mockdate';
import moment from 'moment';

import { selector } from './AvailabilityTimelineContainer';

function getState() {
  return {
    data: {
      resources: {
        'resource-1': {
          id: 'resource-1',
          reservations: [
            {
              id: 111,
              name: 'Reservation 1',
              begin: moment('2016-01-01T02:00:00').format(),
              end: moment('2016-01-01T10:00:00').format(),
            },
            {
              id: 222,
              name: 'Reservation 2',
              begin: moment('2016-01-01T11:30:00').format(),
              end: moment('2016-01-01T18:00:00').format(),
            },
            {
              id: 333,
              name: 'Reservation 3',
              begin: moment('2016-01-01T18:00:00').format(),
              end: moment('2016-01-01T23:30:00').format(),
            },
            {
              id: 444,
              name: 'Cancelled reservation',
              begin: moment('2016-01-01T10:00:00').format(),
              end: moment('2016-01-01T10:30:00').format(),
              state: 'cancelled',
            },
            {
              id: 555,
              name: 'Denied reservation',
              begin: moment('2016-01-01T10:00:00').format(),
              end: moment('2016-01-01T10:30:00').format(),
              state: 'denied',
            },
          ],
        },
        'resource-2': { id: 'resource-2' },
      },
    },
  };
}

describe('shared/availability-view/AvailabilityTimelineContainer', () => {
  describe('selector', () => {
    function getSelected(props) {
      const defaults = { id: 'resource-1', date: '2016-01-01T00:00:00' };
      return selector()(getState(), { ...defaults, ...props });
    }

    describe('items', () => {
      beforeAll(() => {
        mockDate.set('2015-12-01T10:00:00Z');
      });

      afterAll(() => {
        mockDate.reset();
      });

      test('contains slots if no reservations', () => {
        const actual = getSelected({ id: 'resource-2' }).items;
        expect(actual).toHaveLength((24 * 60) / slotSize);
        actual.forEach(slot => expect(slot.type).toBe('reservation-slot'));
      });

      test('contains slots if no reservations for date', () => {
        const actual = getSelected({ date: '2016-01-02T00:00:00' }).items;
        expect(actual).toHaveLength((24 * 60) / slotSize);
        actual.forEach(slot => expect(slot.type).toBe('reservation-slot'));
      });

      test('contains reservations and slots', () => {
        const state = getState();
        const reservations = state.data.resources['resource-1'].reservations;
        const props = { id: 'resource-1', date: '2016-01-01' };
        const actual = selector()(state, props).items;
        expect(actual[0].type).toBe('reservation-slot');
        expect(actual[1].type).toBe('reservation-slot');
        expect(actual[2].type).toBe('reservation-slot');
        expect(actual[3].type).toBe('reservation-slot');
        expect(actual[4]).toEqual({ key: '4', type: 'reservation', data: reservations[0] });
        expect(actual[5].type).toBe('reservation-slot');
        expect(actual[6].type).toBe('reservation-slot');
        expect(actual[7].type).toBe('reservation-slot');
        expect(actual[8]).toEqual({ key: '8', type: 'reservation', data: reservations[1] });
        expect(actual[9]).toEqual({ key: '9', type: 'reservation', data: reservations[2] });
        expect(actual[10].type).toBe('reservation-slot');
      });

      test('contains selectability info', () => {
        const state = getState();
        const reservations = state.data.resources['resource-1'].reservations;
        const selection = {
          begin: '2016-01-01T10:00:00',
          end: '2016-01-01T10:30:00',
          resourceId: 'resource-1',
        };
        const props = { id: 'resource-1', date: '2016-01-01', selection };
        const actual = selector()(state, props).items;
        expect(actual[0].data.isSelectable).toBe(false);
        expect(actual[1].data.isSelectable).toBe(false);
        expect(actual[2].data.isSelectable).toBe(false);
        expect(actual[3].data.isSelectable).toBe(false);
        expect(actual[4]).toEqual({ key: '4', type: 'reservation', data: reservations[0] });
        expect(actual[5].data.isSelectable).toBe(true);
        expect(actual[6].data.isSelectable).toBe(true);
        expect(actual[7].data.isSelectable).toBe(true);
        expect(actual[8]).toEqual({ key: '8', type: 'reservation', data: reservations[1] });
        expect(actual[9]).toEqual({ key: '9', type: 'reservation', data: reservations[2] });
        expect(actual[10].data.isSelectable).toBe(false);
      });
    });
  });
});
