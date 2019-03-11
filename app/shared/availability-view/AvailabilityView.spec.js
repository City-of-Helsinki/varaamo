import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import DateSelector from './DateSelector';
import TimelineGroups from './TimelineGroups';
import AvailabilityView from './AvailabilityView';
import Sidebar from './Sidebar';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    groups: [],
    isAdmin: true,
    onDateChange: () => null,
  };
  return shallow(<AvailabilityView {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityView', () => {
  test('renders a div.availability-view', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-view')).toBe(true);
  });

  test('renders DateSelector', () => {
    const date = '2016-11-12';
    const onDateChange = () => null;
    const element = getWrapper({ date, onDateChange }).find(DateSelector);
    expect(element).toHaveLength(1);
    expect(element.prop('value')).toBe(date);
    expect(element.prop('onChange')).toBe(onDateChange);
  });

  test('renders Sidebar', () => {
    const date = '2016-11-12';
    const groups = [];
    const element = getWrapper({ date, groups }).find(Sidebar);
    expect(element).toHaveLength(1);
    expect(element.prop('date')).toBe(date);
    expect(element.prop('groups')).toBe(groups);
  });

  test('renders TimelineGroups', () => {
    const date = '2016-11-12';
    const groups = [];
    const element = getWrapper({ date, groups }).find(TimelineGroups);
    expect(element).toHaveLength(1);
    expect(element.prop('date')).toBe(date);
    expect(element.prop('groups')).toBe(groups);
  });

  test('has correct initial state', () => {
    const wrapper = getWrapper();
    expect(wrapper.state()).toEqual({ hoverSelection: null, selection: null });
  });

  describe('getSelection', () => {
    function getSelection(selection, hoverSelection) {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.state = { selection, hoverSelection };
      return instance.getSelection();
    }

    test('returns selection if only selection', () => {
      const selection = {};
      expect(getSelection(selection, null)).toBe(selection);
    });

    test('returns hoverSelection if only hoverSelection', () => {
      const hoverSelection = { some: 'data' };
      expect(getSelection(null, hoverSelection)).toEqual({
        ...hoverSelection,
        hover: true,
      });
    });

    test('returns null if neither', () => {
      expect(getSelection(null, null)).toBeNull();
    });

    test('returns selection with hoverSelection.end if both', () => {
      const selection = { begin: '1-begin', end: '1-end', resourceId: '1-resourceId' };
      const hoverSelection = { begin: '2-begin', end: '2-end', resourceId: '2-resourceId' };
      expect(getSelection(selection, hoverSelection)).toEqual({
        begin: '1-begin',
        end: '2-end',
        resourceId: '1-resourceId',
      });
    });
  });

  describe('handleReservationSlotMouseLeave', () => {
    const begin = '2017-01-01T10:00:00Z';
    const end = '2017-01-01T10:30:00Z';
    const resourceId = 'auxxnen1';

    function getHoverSelection(slot, state) {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      if (state) instance.state = state;
      instance.handleReservationSlotMouseLeave(slot);
      return wrapper.state().hoverSelection;
    }

    test('does nothing if existing hoverSelection is null', () => {
      expect(getHoverSelection({ begin, end, resourceId })).toBeNull();
    });

    test('does nothing if existing hoverSelection is different', () => {
      const selection = { begin, end, resourceId };
      const hoverSelection = { begin: 'foo' };
      expect(getHoverSelection(selection, { hoverSelection })).toBe(hoverSelection);
    });

    test('sets hoverSelection to null if existing is the same', () => {
      const selection = { begin, end, resourceId };
      const hoverSelection = { begin, end, resourceId };
      expect(getHoverSelection(selection, { hoverSelection })).toBeNull();
    });
  });

  describe('handleReservationSlotMouseEnter', () => {
    const begin = '2017-01-01T10:00:00Z';
    const end = '2017-01-01T10:30:00Z';
    const resourceId = 'auxxnen1';

    function getHoverSelection(slot, state) {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      if (state) instance.state = state;
      instance.handleReservationSlotMouseEnter(slot);
      return wrapper.state().hoverSelection;
    }

    test('updates hoverSelection if no state.selection', () => {
      const selection = { begin, end, resourceId };
      expect(getHoverSelection(selection)).toBe(selection);
    });

    test('updates hoverSelection if is selectable', () => {
      const selection = { begin, end, resourceId };
      const existing = {
        begin: '2017-01-01T09:00:00Z',
        end: '2017-01-01T09:30:00Z',
        resourceId,
      };
      expect(getHoverSelection(selection, { selection: existing })).toBe(selection);
    });

    test('does not update hoverSelection if different resource', () => {
      const selection = { begin, end, resourceId };
      const existing = {
        begin: '2017-01-01T09:00:00Z',
        end: '2017-01-01T09:30:00Z',
        resourceId: 'xiauenqi',
      };
      expect(getHoverSelection(selection, { selection: existing })).toBeUndefined();
    });

    test('does not update hoverSelection if before selection', () => {
      const selection = { begin, end, resourceId };
      const existing = {
        begin: '2017-01-01T10:30:00Z',
        end: '2017-01-01T11:00:00Z',
        resourceId,
      };
      expect(getHoverSelection(selection, { selection: existing })).toBeUndefined();
    });
  });

  describe('handleSelectionCancel', () => {
    function handleSelectionCancel() {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.state = { selection: { some: 'data' }, hoverSelection: { more: 'data' } };
      instance.handleSelectionCancel();
      return wrapper.state();
    }

    test('is given to TimelineGroups', () => {
      const wrapper = getWrapper();
      const groups = wrapper.find(TimelineGroups);
      const handler = wrapper.instance().handleSelectionCancel;
      expect(groups.prop('onSelectionCancel')).toBe(handler);
    });

    test('clears selection and hoverSelection', () => {
      expect(handleSelectionCancel()).toEqual({
        selection: null,
        hoverSelection: null,
      });
    });
  });

  describe('handleReservationSlotClick', () => {
    function handleReservationSlotClick(slot) {
      const wrapper = getWrapper();
      wrapper.instance().handleReservationSlotClick(slot);
      return wrapper.state();
    }

    test('is given to TimelineGroups', () => {
      const wrapper = getWrapper();
      const groups = wrapper.find(TimelineGroups);
      const handler = wrapper.instance().handleReservationSlotClick;
      expect(groups.prop('onReservationSlotClick')).toBe(handler);
    });

    describe('when no existing selection', () => {
      test('adds selection', () => {
        const selection = {
          begin: '2017-01-01T10:00:00Z',
          end: '2017-01-01T10:30:00Z',
          resourceId: 'auuexui389aeoord',
        };
        const state = handleReservationSlotClick(selection);
        expect(state).toEqual({ hoverSelection: null, selection });
      });
    });

    describe('when existing selection', () => {
      function doSelect(props, startSlot, endSlot) {
        const wrapper = getWrapper(props);
        const instance = wrapper.instance();
        instance.handleReservationSlotClick(startSlot);
        instance.handleReservationSlotClick(endSlot);
        return wrapper;
      }

      describe('when valid end slot', () => {
        test('sets selection to null', () => {
          const resourceId = 'resource-id';
          const wrapper = doSelect(
            {},
            { resourceId, begin: '2016-01-01T10:00:00Z' },
            { resourceId, begin: '2016-01-01T10:00:00Z', end: '2016-01-01T10:30:00Z' }
          );
          expect(wrapper.state()).toEqual({ hoverSelection: null, selection: null });
        });

        test('calls props.onSelect', () => {
          const onSelect = simple.mock();
          const resourceId = 'resource-id';
          doSelect(
            { onSelect },
            { resourceId, begin: '2016-01-01T10:30:00Z', end: '2016-01-01T11:00:00Z' },
            { resourceId, begin: '2016-01-01T11:00:00Z', end: '2016-01-01T11:30:00Z' }
          );
          expect(onSelect.callCount).toBe(1);
          expect(onSelect.lastCall.args).toEqual([{
            resourceId,
            begin: '2016-01-01T10:30:00Z',
            end: '2016-01-01T11:30:00Z',
          }]);
        });
      });

      describe('end slot is invalid', () => {
        function checkInvalid(begin, end) {
          const onSelect = simple.mock();
          const wrapper = doSelect({ onSelect }, begin, end);
          expect(wrapper.state()).toEqual({ hoverSelection: null, selection: begin });
          expect(onSelect.called).toBe(false);
        }

        test('if after start time', () => {
          const resourceId = 'resource';
          checkInvalid(
            { resourceId, begin: '2016-01-01T10:00:00Z' },
            { resourceId, begin: '2016-01-01T09:30:00Z', end: '2016-01-01T10:00:00Z' }
          );
        });

        test('if different resource', () => {
          checkInvalid(
            { resourceId: 'r1', begin: '2016-01-01T10:00:00Z' },
            {
              resourceId: 'r2',
              begin: '2016-01-01T10:30:00Z',
              end: '2016-01-01T11:00:00Z'
            }
          );
        });
      });
    });
  });
});
