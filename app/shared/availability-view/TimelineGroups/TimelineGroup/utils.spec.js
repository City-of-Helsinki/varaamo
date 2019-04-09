import mockDate from 'mockdate';
import moment from 'moment';

import utils from './utils';

describe('shared/availability-view/utils', () => {
  describe('getTimeSlotWidth', () => {
    const slotWidth = 30;
    const slotMargin = 0;

    test('returns one slot width with no arguments', () => {
      const actual = utils.getTimeSlotWidth();
      expect(actual).toBe(slotWidth - slotMargin);
    });

    test('returns one slot width for 30 min span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T12:30:00Z'),
      });
      expect(actual).toBe(slotWidth - slotMargin);
    });

    test('returns two slot width for 1 hour span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T13:00:00Z'),
      });
      expect(actual).toBe((slotWidth * 2) - slotMargin);
    });

    test('returns twenty slot width for 10 hour span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T22:00:00Z'),
      });
      expect(actual).toBe((slotWidth * 20) - slotMargin);
    });
  });

  describe('addSelectionData', () => {
    const items = [
      {
        data: {
          begin: '2016-01-01T11:00:00Z',
          end: '2016-01-01T11:30:00Z',
          isSelectable: false,
        },
        type: 'reservation-slot',
      },
      {
        data: {
          begin: '2016-01-01T11:30:00Z',
          end: '2016-01-01T12:00:00Z',
          isSelectable: false,
        },
        type: 'reservation-slot',
      },
      {
        data: {
          begin: '2016-01-01T12:00:00Z',
          end: '2016-01-01T12:30:00Z',
          isSelectable: false,
        },
        type: 'reservation',
      },
      {
        data: {
          begin: '2016-01-01T12:30:00Z',
          end: '2016-01-01T13:00:00Z',
          isSelectable: false,
        },
        type: 'reservation-slot',
      },
      {
        data: {
          begin: '2016-01-01T13:00:00Z',
          end: '2016-01-01T13:30:00Z',
          isSelectable: false,
        },
        type: 'reservation-slot',
      },
    ];

    function getItems(slot1, slot2, slot3, slot4) {
      return [
        { ...items[0], data: { ...items[0].data, isSelectable: slot1 } },
        { ...items[1], data: { ...items[1].data, isSelectable: slot2 } },
        items[2],
        { ...items[3], data: { ...items[3].data, isSelectable: slot3 } },
        { ...items[4], data: { ...items[4].data, isSelectable: slot4 } },
      ];
    }

    beforeEach(() => {
      mockDate.set('2015-12-01T10:00:00Z');
    });

    afterAll(() => {
      mockDate.reset();
    });

    test('marks all selectable if no selection', () => {
      const expected = getItems(true, true, true, true);
      const actual = utils.addSelectionData(null, { id: 'r1' }, items);
      expect(actual).toEqual(expected);
    });

    test('marks all not selectable if selection in another resource', () => {
      const expected = getItems(false, false, false, false);
      const selection = { begin: '2016-01-01T11:30:00Z', resourceId: 'r2' };
      const actual = utils.addSelectionData(selection, { id: 'r1' }, items);
      expect(actual).toEqual(expected);
    });

    test('marks selectable if selection in this resource', () => {
      const expected = getItems(false, false, false, true);
      const selection = { begin: '2016-01-01T13:00:00Z', resourceId: 'r1' };
      const actual = utils.addSelectionData(selection, { id: 'r1' }, items);
      expect(actual).toEqual(expected);
    });

    test('only marks selectable until next reservation', () => {
      const expected = getItems(true, true, false, false);
      const selection = { begin: '2016-01-01T11:00:00Z', resourceId: 'r1' };
      const actual = utils.addSelectionData(selection, { id: 'r1' }, items);
      expect(actual).toEqual(expected);
    });

    test('marks not selectable if in the past', () => {
      mockDate.set('2016-02-01T10:00:00Z');
      const expected = getItems(false, false, false, false);
      const actual = utils.addSelectionData(null, { id: 'r1' }, items);
      expect(actual).toEqual(expected);
    });

    test('marks not selectable if outside available hours', () => {
      const expected = getItems(false, true, false, true);
      const resource = {
        id: 'r1',
        openingHours: [
          { opens: '2016-01-01T11:30:00Z', closes: '2016-01-01T12:30:00Z' },
          { opens: '2016-01-01T13:00:00Z', closes: '2016-01-01T13:30:00Z' },
        ],
      };
      const actual = utils.addSelectionData(null, resource, items);
      expect(actual).toEqual(expected);
    });
  });

  describe('getTimelineItems', () => {
    test('returns reservation slots if reservations is undefined', () => {
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00Z'), undefined, '1');
      expect(actual).toHaveLength(48);
      actual.forEach(item => expect(item.type).toBe('reservation-slot'));
    });

    test('returns reservation slots if reservations is empty', () => {
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00Z'), [], '1');
      expect(actual).toHaveLength(48);
      actual.forEach(item => expect(item.type).toBe('reservation-slot'));
    });

    test('returns one reservation if entire day is a reservation', () => {
      const reservation = { id: 11, begin: '2016-01-01T00:00:00', end: '2016-01-02T00:00:00' };
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00'), [reservation], '1');
      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual({
        key: '0',
        type: 'reservation',
        data: reservation,
      });
    });

    test('returns reservations and slots', () => {
      const reservations = [
        { id: 11, begin: '2016-01-01T02:00:00', end: '2016-01-01T10:00:00' },
        { id: 12, begin: '2016-01-01T12:30:00', end: '2016-01-01T20:00:00' },
        { id: 13, begin: '2016-01-01T20:00:00', end: '2016-01-01T20:30:00' },
      ];
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00'), reservations, '1');
      const expected = [
        {
          key: '0',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:00:00').format(),
            end: moment('2016-01-01T00:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:30:00').format(),
            end: moment('2016-01-01T01:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '2',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:00:00').format(),
            end: moment('2016-01-01T01:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:30:00').format(),
            end: moment('2016-01-01T02:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        { key: '4', type: 'reservation', data: reservations[0] },
        {
          key: '5',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T10:00:00').format(),
            end: moment('2016-01-01T10:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '6',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T10:30:00').format(),
            end: moment('2016-01-01T11:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '7',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T11:00:00').format(),
            end: moment('2016-01-01T11:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '8',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T11:30:00').format(),
            end: moment('2016-01-01T12:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '9',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T12:00:00').format(),
            end: moment('2016-01-01T12:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        { key: '10', type: 'reservation', data: reservations[1] },
        { key: '11', type: 'reservation', data: reservations[2] },
        {
          key: '12',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T20:30:00').format(),
            end: moment('2016-01-01T21:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '13',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T21:00:00').format(),
            end: moment('2016-01-01T21:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '14',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T21:30:00').format(),
            end: moment('2016-01-01T22:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '15',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T22:00:00').format(),
            end: moment('2016-01-01T22:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '16',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T22:30:00').format(),
            end: moment('2016-01-01T23:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '17',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T23:00:00').format(),
            end: moment('2016-01-01T23:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '18',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T23:30:00').format(),
            end: moment('2016-01-02T00:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
      ];
      expect(actual).toEqual(expected);
    });
  });
});
