import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from '../../../../../utils/fixtures/Resource';
import { shallowWithIntl } from '../../../../../utils/testUtils';
import TimeSlots from '../TimeSlots';
import TimeSlotPlaceholder from '../TimeSlotPlaceholder';

describe('pages/resource/reservation-calendar/time-slots/TimeSlots', () => {
  const defaultSlots = [
    [
      {
        asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T11:00:00.000Z',
        asString: '10:00-11:00',
        end: '2016-10-10T11:00:00.000Z',
        index: 0,
        reserved: false,
        resource: 'some-resource-id',
        start: '2016-10-10T10:00:00.000Z',
      },
    ],
    [
      {
        asISOString: '2016-10-11T10:00:00.000Z/2016-10-11T11:00:00.000Z',
        asString: '10:00-11:00',
        end: '2016-10-11T11:00:00.000Z',
        index: 0,
        reserved: false,
        resource: 'some-resource-id',
        start: '2016-10-11T10:00:00.000Z',
      },
    ],
  ];
  const defaultProps = {
    addNotification: simple.stub(),
    isAdmin: false,
    isEditing: false,
    isFetching: false,
    isLoggedIn: true,
    isUnderMinPeriod: false,
    onClear: simple.stub(),
    onClick: simple.stub(),
    resource: Resource.build(),
    selected: [
      {
        begin: defaultSlots[0][0].start,
        end: defaultSlots[0][0].end,
        resource: defaultSlots[0][0].resource,
      },
    ],
    selectedDate: '2016-10-10',
    slots: Immutable(defaultSlots),
  };

  function getWrapper(props) {
    return shallowWithIntl(<TimeSlots {...defaultProps} {...props} />);
  }

  test('renders div.app-TimeSlots', () => {
    const div = getWrapper().find('div.app-TimeSlots');
    expect(div).toHaveLength(1);
  });

  test('renders a positional placeholder if the start times differ', () => {
    const slots = [
      [
        {
          asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T11:00:00.000Z',
          asString: '10:00-11:00',
          end: '2016-10-10T11:00:00.000Z',
          index: 0,
          reserved: false,
          resource: 'some-resource-id',
          start: '2016-10-10T10:00:00.000Z',
        },
      ],
      [
        {
          asISOString: '2016-10-11T11:00:00.000Z/2016-10-11T12:00:00.000Z',
          asString: '11:00-12:00',
          end: '2016-10-11T12:00:00.000Z',
          index: 0,
          reserved: false,
          resource: 'some-resource-id',
          start: '2016-10-11T11:00:00.000Z',
        },
      ],
    ];
    const placeholder = getWrapper({ slots }).find(TimeSlotPlaceholder);
    expect(placeholder).toHaveLength(1);
    expect(placeholder.prop('size')).toBe(1);
  });

  test(
    'changes the size of the placeholder based on the length of the time slot',
    () => {
      const slots = [
        [
          {
            asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T10:30:00.000Z',
            asString: '10:00-10:30',
            end: '2016-10-10T10:30:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-10T10:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-11T11:00:00.000Z/2016-10-11T11:30:00.000Z',
            asString: '11:00-11:30',
            end: '2016-10-11T11:30:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-11T11:00:00.000Z',
          },
        ],
      ];
      const placeholder = getWrapper({ slots }).find(TimeSlotPlaceholder);
      expect(placeholder).toHaveLength(1);
      expect(placeholder.prop('size')).toBe(2);
    }
  );

  test(
    'renders positional placeholders with mobile offsets if all mobile view columns have placeholders',
    () => {
      const slots = [
        [
          {
            asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T11:00:00.000Z',
            asString: '10:00-11:00',
            end: '2016-10-10T11:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-10T10:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-11T12:00:00.000Z/2016-10-11T13:00:00.000Z',
            asString: '12:00-13:00',
            end: '2016-10-11T13:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-11T12:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-12T10:00:00.000Z/2016-10-12T11:00:00.000Z',
            asString: '13:00-14:00',
            end: '2016-10-12T14:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-12T13:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-13T10:00:00.000Z/2016-10-13T11:00:00.000Z',
            asString: '14:00-15:00',
            end: '2016-10-13T15:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-13T14:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-14T10:00:00.000Z/2016-10-14T11:00:00.000Z',
            asString: '10:00-11:00',
            end: '2016-10-14T11:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-14T10:00:00.000Z',
          },
        ],
      ];
      const placeholder = getWrapper({ selectedDate: '2016-10-11', slots }).find(TimeSlotPlaceholder);
      expect(placeholder).toHaveLength(3);
      expect(placeholder.first().prop('mobileOffset')).toBe(2);
    }
  );

  describe('getReservationBegin', () => {
    test('returns the begin value of the selected slot', () => {
      const instance = getWrapper().instance();
      const firstSelectedSlot = defaultProps.selected[0];
      expect(instance.getReservationBegin()).toBe(firstSelectedSlot.begin);
    });

    test('returns an empty string if the there are no selected slots', () => {
      const instance = getWrapper({ selected: [] }).instance();
      expect(instance.getReservationBegin()).toBe('');
    });
  });

  describe('getReservationEnd', () => {
    test('returns the end value of the lest selected slot', () => {
      const instance = getWrapper().instance();
      const lastSelectedSlot = defaultProps.selected[defaultProps.selected.length - 1];
      expect(instance.getReservationEnd()).toBe(lastSelectedSlot.end);
    });

    test('returns an empty string if the there are no selected slots', () => {
      const instance = getWrapper({ selected: [] }).instance();
      expect(instance.getReservationEnd()).toBe('');
    });
  });
});
