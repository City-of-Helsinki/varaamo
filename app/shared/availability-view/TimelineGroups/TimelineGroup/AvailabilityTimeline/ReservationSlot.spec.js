import { shallow } from 'enzyme';
import simple from 'simple-mock';
import React from 'react';

import ReservationPopover from 'shared/reservation-popover';
import { UninjectedReservationSlot as ReservationSlot } from './ReservationSlot';
import utils from '../utils';

function getWrapper(props) {
  const defaults = {
    begin: '2017-01-01T10:00:00Z',
    end: '2017-01-01T10:30:00Z',
    resourceId: '1',
    isSelectable: true,
    t: s => s,
  };
  return shallow(<ReservationSlot {...defaults} {...props} />);
}

describe('shared/availability-view/ReservationSlot', () => {
  test('returns a button.reservation-slot', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('button')).toBe(true);
    expect(wrapper.hasClass('reservation-slot')).toBe(true);
  });

  test('has correct width', () => {
    const expected = utils.getTimeSlotWidth();
    const actual = getWrapper().prop('style');
    expect(actual).toEqual({ width: expected });
  });

  test('binds onClick to handleClick', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(wrapper.prop('onClick')).toBe(instance.handleClick);
  });

  describe('Popover', () => {
    function getPopover(props) {
      const wrapper = getWrapper(props);
      return wrapper.find(ReservationPopover);
    }

    describe('is not rendered when the slot', () => {
      test('has no selection', () => {
        const popover = getPopover({ selection: null });
        expect(popover).toHaveLength(0);
      });

      test('is not in selection', () => {
        const popover = getPopover({
          begin: '2016-01-01T10:00:00Z',
          end: '2016-01-01T10:30:00Z',
          selection: {
            begin: '2016-01-01T10:30:00Z',
            end: '2016-01-01T12:00:00Z',
            resourceId: '1',
          },
        });
        expect(popover).toHaveLength(0);
      });

      test('is inside selection but not the first slot', () => {
        const popover = getPopover({
          begin: '2016-01-01T10:00:00Z',
          end: '2016-01-01T10:30:00Z',
          selection: {
            begin: '2016-01-01T09:30:00Z',
            end: '2016-01-01T12:00:00Z',
            resourceId: '1',
          },
        });
        expect(popover).toHaveLength(0);
      });

      test('is inside hover selection', () => {
        const popover = getPopover({
          begin: '2016-01-01T10:00:00Z',
          end: '2016-01-01T10:30:00Z',
          selection: {
            begin: '2016-01-01T10:00:00Z',
            end: '2016-01-01T12:00:00Z',
            resourceId: '1',
            hover: true,
          },
        });
        expect(popover).toHaveLength(0);
      });
    });

    test('is rendered if beginning of selection', () => {
      const popover = getPopover({
        begin: '2016-01-01T10:00:00Z',
        end: '2016-01-01T10:30:00Z',
        selection: {
          begin: '2016-01-01T10:00:00Z',
          end: '2016-01-01T12:00:00Z',
          resourceId: '1',
        },
      });
      expect(popover).toHaveLength(1);
    });
  });

  describe('selection', () => {
    function isSelected(props, selection) {
      const defaultProps = {
        begin: '2016-01-01T10:00:00',
        end: '2016-01-01T10:30:00',
        selection: {
          begin: '2016-01-01T10:00:00',
          end: '2016-01-01T11:00:00',
          resourceId: '1',
          ...selection,
        },
        resourceId: '1',
      };
      const wrapper = getWrapper({ ...defaultProps, ...props });
      return wrapper.find('button').hasClass('reservation-slot-selected');
    }

    test('is selected if begin and end are same as selected', () => {
      const actual = isSelected({}, { end: '2016-01-01T10:30:00' });
      expect(actual).toBe(true);
    });

    test('is selected if begin and end are inside selected', () => {
      const actual = isSelected({}, { begin: '2016-01-01T09:00:00' });
      expect(actual).toBe(true);
    });

    test('is not selected if begin before selection', () => {
      const actual = isSelected({}, { begin: '2016-01-01T10:15:00' });
      expect(actual).toBe(false);
    });

    test('is not selected if end after selection', () => {
      const actual = isSelected({}, { end: '2016-01-01T10:15:00' });
      expect(actual).toBe(false);
    });

    test('is not selected if no selection', () => {
      const wrapper = getWrapper();
      const actual = wrapper.hasClass('reservation-slot-selected');
      expect(actual).toBe(false);
    });

    test('is not selected if selection.resourceId is different', () => {
      const actual = isSelected({}, { resourceId: '2' });
      expect(actual).toBe(false);
    });

    test('is selected if selection.resourceId is the same', () => {
      const actual = isSelected({}, { resourceId: '1' });
      expect(actual).toBe(true);
    });
  });

  describe('handleClick', () => {
    describe('if isSelectable', () => {
      function callHandleClick({ preventDefault }, props) {
        const wrapper = getWrapper({ onClick: () => null, ...props });
        const event = { preventDefault: preventDefault || (() => null) };
        return wrapper.instance().handleClick(event);
      }

      test('calls event.preventDefault', () => {
        const preventDefault = simple.mock();
        callHandleClick({ preventDefault });
        expect(preventDefault.callCount).toBe(1);
      });

      test('calls onClick', () => {
        const onClick = simple.mock();
        const begin = '2017-01-02T14:00:00Z';
        const end = '2017-01-02T14:30:00Z';
        const resourceId = 'auuxn391';
        callHandleClick({}, {
          begin, end, onClick, resourceId
        });
        expect(onClick.callCount).toBe(1);
        expect(onClick.lastCall.args).toEqual([{ begin, end, resourceId }]);
      });

      test('does not call onSelectionCancel', () => {
        const onSelectionCancel = simple.mock();
        callHandleClick({}, { onSelectionCancel, isSelectable: true });
        expect(onSelectionCancel.called).toBe(false);
      });
    });

    describe('if not isSelectable', () => {
      function callHandleClick({ preventDefault }, props) {
        const wrapper = getWrapper({
          isSelectable: false,
          onSelectionCancel: () => null,
          ...props,
        });
        const event = { preventDefault: preventDefault || (() => null) };
        return wrapper.instance().handleClick(event);
      }

      test('calls event.preventDefault', () => {
        const preventDefault = simple.mock();
        callHandleClick({ preventDefault });
        expect(preventDefault.callCount).toBe(1);
      });

      test('does not call onClick', () => {
        const onClick = simple.mock();
        callHandleClick({}, { onClick });
        expect(onClick.called).toBe(false);
      });

      test('calls onSelectionCancel', () => {
        const onSelectionCancel = simple.mock();
        callHandleClick({}, { onSelectionCancel });
        expect(onSelectionCancel.callCount).toBe(1);
      });
    });

    describe('if no click handler', () => {
      function callHandleClick({ preventDefault }) {
        const wrapper = getWrapper({ onClick: undefined });
        const event = { preventDefault: preventDefault || (() => null) };
        return wrapper.instance().handleClick(event);
      }

      test('does not call event.preventDefault', () => {
        const preventDefault = simple.mock();
        callHandleClick({ preventDefault });
        expect(preventDefault.called).toBe(false);
      });
    });
  });
});
