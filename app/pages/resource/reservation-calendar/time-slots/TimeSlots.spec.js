import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import TimeSlots from './TimeSlots';
import TimeSlotComponent from './TimeSlot';
import TimeSlotPlaceholder from './TimeSlotPlaceholder';

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
    expect(div).to.have.length(1);
  });

  describe('rendering individual time slots', () => {
    function getTimeSlotsWrapper(props) {
      return getWrapper(props).find(TimeSlotComponent);
    }

    test('renders a TimeSlot component for every time slot in props', () => {
      expect(getTimeSlotsWrapper()).to.have.length(2);
    });

    test('passes correct props to TimeSlots', () => {
      const timeSlots = getTimeSlotsWrapper();
      timeSlots.forEach((timeSlot, index) => {
        expect(timeSlot.props().addNotification).to.equal(defaultProps.addNotification);
        expect(timeSlot.props().isAdmin).to.equal(defaultProps.isAdmin);
        expect(timeSlot.props().isEditing).to.equal(defaultProps.isEditing);
        expect(timeSlot.props().isLoggedIn).to.equal(defaultProps.isLoggedIn);
        expect(timeSlot.props().isStaff).to.equal(defaultProps.isStaff);
        expect(timeSlot.props().onClick).to.equal(defaultProps.onClick);
        expect(timeSlot.props().resource).to.deep.equal(defaultProps.resource);
        expect(timeSlot.props().slot).to.deep.equal(defaultProps.slots[index][0]);
      });
    });

    test('passes correct selected as a prop to TimeSlot', () => {
      const timeSlots = getTimeSlotsWrapper();
      expect(timeSlots.at(0).props().selected).to.equal(true);
      expect(timeSlots.at(1).props().selected).to.equal(false);
    });
  });

  test(
    'renders reserved slot and slots after reserved as not selectable',
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
          {
            asISOString: '2016-10-10T11:00:00.000Z/2016-10-10T12:00:00.000Z',
            asString: '11:00-12:00',
            end: '2016-10-10T12:00:00.000Z',
            index: 0,
            reserved: true,
            resource: 'some-resource-id',
            start: '2016-10-10T11:00:00.000Z',
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
      const selected = [
        {
          begin: slots[0][0].start,
          end: slots[0][0].end,
          resource: slots[0][0].resource,
        },
      ];
      const timeSlots = getWrapper({ selected, slots }).find(TimeSlotComponent);

      expect(timeSlots).to.have.length(3);
      expect(timeSlots.at(0).props().isSelectable).to.be.true;
      expect(timeSlots.at(1).props().isSelectable).to.be.false;
      expect(timeSlots.at(2).props().isSelectable).to.be.false;
    }
  );

  test('renders a closed message when resource is not open', () => {
    const closedSlot = [[{ start: '2016-10-12T10:00:00.000Z' }]];
    const props = {
      slots: [...defaultProps.slots, ...closedSlot],
    };
    const wrapper = getWrapper(props);
    const timeSlots = wrapper.find(TimeSlotComponent);
    const closedMessage = wrapper.find('.app-TimeSlots--closed');

    expect(timeSlots).to.have.length(2);
    expect(closedMessage).to.have.length(1);
  });

  test('does not render empty slots', () => {
    const emptySlot = [[]];
    const props = {
      slots: [...defaultProps.slots, ...emptySlot],
    };
    const timeSlots = getWrapper(props).find(TimeSlotComponent);

    expect(timeSlots).to.have.length(2);
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
    expect(placeholder).to.have.length(1);
    expect(placeholder.prop('size')).to.equal(1);
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
      expect(placeholder).to.have.length(1);
      expect(placeholder.prop('size')).to.equal(2);
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
      expect(placeholder).to.have.length(3);
      expect(placeholder.first().prop('mobileOffset')).to.equal(2);
    }
  );

  describe('getReservationBegin', () => {
    test('returns the begin value of the selected slot', () => {
      const instance = getWrapper().instance();
      const firstSelectedSlot = defaultProps.selected[0];
      expect(instance.getReservationBegin()).to.equal(firstSelectedSlot.begin);
    });

    test('returns an empty string if the there are no selected slots', () => {
      const instance = getWrapper({ selected: [] }).instance();
      expect(instance.getReservationBegin()).to.equal('');
    });
  });

  describe('getReservationEnd', () => {
    test('returns the end value of the lest selected slot', () => {
      const instance = getWrapper().instance();
      const lastSelectedSlot = defaultProps.selected[defaultProps.selected.length - 1];
      expect(instance.getReservationEnd()).to.equal(lastSelectedSlot.end);
    });

    test('returns an empty string if the there are no selected slots', () => {
      const instance = getWrapper({ selected: [] }).instance();
      expect(instance.getReservationEnd()).to.equal('');
    });
  });

  describe('isMaxExceeded', () => {
    describe('is Admin', () => {
      test('enables all TimeSlots even if maxPeriod is specified', () => {
        const renderedTimeSlots = getWrapper({ isAdmin: true, maxPeriod: '00:60:00' })
          .find(TimeSlotComponent);
        expect(renderedTimeSlots.first().prop('isDisabled')).to.be.false;
        expect(renderedTimeSlots.at(1).prop('isDisabled')).to.be.false;
      });
    });

    describe('is not Admin', () => {
      test('enables all TimeSlots if maxPeriod in not defined', () => {
        const renderedTimeSlots = getWrapper().find(TimeSlotComponent);
        expect(renderedTimeSlots.first().prop('isDisabled')).to.be.false;
        expect(renderedTimeSlots.at(1).prop('isDisabled')).to.be.false;
      });

      test(
        'disables TimeSlot when the reservation length is longer than maxPeriod',
        () => {
          const resourceMaxPeriod = Resource.build({ maxPeriod: '00:60:00' });
          const renderedTimeSlots = getWrapper(
            { resource: resourceMaxPeriod }
          ).find(TimeSlotComponent);
          expect(renderedTimeSlots.first().prop('isDisabled')).to.be.false;
          expect(renderedTimeSlots.at(1).prop('isDisabled')).to.be.true;
        }
      );
    });
  });
});
