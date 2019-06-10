import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from '../../../../utils/fixtures/Resource';
import TimeSlotFixture from '../../../../utils/fixtures/TimeSlot';
import { shallowWithIntl } from '../../../../utils/testUtils';
import { padLeft } from '../../../../utils/timeUtils';
import TimeSlot from './TimeSlot';

describe('pages/resource/reservation-calendar/time-slots/TimeSlot', () => {
  const defaultProps = {
    addNotification: simple.stub(),
    isAdmin: false,
    isEditing: true,
    isHighlighted: false,
    isUnderMinPeriod: false,
    isLoggedIn: true,
    isSelectable: true,
    onClear: simple.stub(),
    onClick: simple.stub(),
    onMouseEnter: simple.stub(),
    onMouseLeave: simple.stub(),
    resource: Resource.build(),
    selected: false,
    showClear: false,
    slot: Immutable(TimeSlotFixture.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<TimeSlot {...defaultProps} {...extraProps} />);
  }

  function getClickableButton(props) {
    return getWrapper(props).find('button.app-TimeSlot__action');
  }

  test('renders button.app-TimeSlot__action', () => {
    expect(getClickableButton()).toHaveLength(1);
  });

  test('does not render clear button when clearing disabled', () => {
    expect(getWrapper().find('button.app-TimeSlot__clear')).toHaveLength(0);
  });

  test('renders clear button when clearing enabled', () => {
    expect(getWrapper({ showClear: true }).find('button.app-TimeSlot__clear')).toHaveLength(1);
  });

  test('renders slot start time as button text', () => {
    const start = new Date(defaultProps.slot.start);
    const expected = `${padLeft(start.getHours())}:${padLeft(start.getMinutes())}`;
    expect(getWrapper().text()).toContain(expected);
  });

  test('disables the time slot when isDisabled prop is true', () => {
    expect(getWrapper({ isDisabled: true }).find('div.app-TimeSlot--disabled')).toHaveLength(1);
  });

  describe('button onClick when user is not logged in', () => {
    let instance;
    let wrapper;
    let button;

    beforeAll(() => {
      wrapper = getWrapper({ isLoggedIn: false });
      instance = wrapper.instance();
      button = wrapper.find('button.app-TimeSlot__action');
      instance.handleClick = simple.mock();
    });

    afterEach(() => {
      instance.handleClick.reset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleClick with disabled true', () => {
      expect(typeof button.prop('onClick')).toBe('function');
      button.prop('onClick')();
      expect(instance.handleClick.callCount).toBe(1);
      expect(instance.handleClick.lastCall.args).toEqual([true]);
    });
  });

  describe('button onClick when user is logged in', () => {
    let instance;
    let wrapper;
    let button;

    beforeAll(() => {
      wrapper = getWrapper({ isLoggedIn: true });
      instance = wrapper.instance();
      button = wrapper.find('button.app-TimeSlot__action');
      instance.handleClick = simple.mock();
    });

    afterEach(() => {
      instance.handleClick.reset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleClick with disabled false', () => {
      expect(typeof button.prop('onClick')).toBe('function');
      button.prop('onClick')();
      expect(instance.handleClick.callCount).toBe(1);
      expect(instance.handleClick.lastCall.args).toEqual([false]);
    });
  });

  describe('getReservationInfoNotification', () => {
    test('returns null when slot end in past', () => {
      const t = simple.stub();
      const slot = { end: '2016-10-11T10:00:00.000Z' };
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, {}, slot, t);

      expect(result).toBeNull();
      expect(t.callCount).toBe(0);
    });

    test('returns null when slot reserved', () => {
      const t = simple.stub();
      const slot = { reserved: true };
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, {}, slot, t);

      expect(result).toBeNull();
      expect(t.callCount).toBe(0);
    });

    test('returns message when not logged in and resource is reservable', () => {
      const message = 'some message';
      const t = simple.stub().returnWith(message);
      const resource = Resource.build({ reservable: true });
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(false, resource, defaultProps.slot, t);

      expect(t.callCount).toBe(1);
      expect(result.message).toBe(message);
      expect(result.type).toBe('info');
      expect(result.timeOut).toBe(10000);
    });

    test('returns correct message when logged in', () => {
      const t = simple.stub();
      const resource = Resource.build({ reservationInfo: 'reservation info' });
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, resource, defaultProps.slot, t);

      expect(t.callCount).toBe(0);
      expect(result.message).toBe(resource.reservationInfo);
      expect(result.type).toBe('info');
      expect(result.timeOut).toBe(10000);
    });
  });

  describe('handleClick when disabled is true', () => {
    const addNotification = simple.stub();
    const onClick = simple.stub();
    const message = {
      message: 'some message',
      type: 'info',
      timeOut: 100,
    };
    let instance;
    let wrapper;

    beforeAll(() => {
      wrapper = getWrapper({
        addNotification,
        isLoggedIn: false,
        onClick,
      });
      instance = wrapper.instance();
      simple.mock(instance, 'getReservationInfoNotification').returnWith(message);
      wrapper.instance().handleClick(true);
    });

    afterAll(() => {
      instance.getReservationInfoNotification.reset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls addNotification prop', () => {
      expect(onClick.callCount).toBe(0);
      expect(instance.getReservationInfoNotification.callCount).toBe(1);
      expect(addNotification.callCount).toBe(1);
      expect(addNotification.lastCall.args).toEqual([message]);
    });
  });

  describe('show warning notification', () => {
    const addNotification = simple.stub();
    const onClick = simple.stub();
    let instance;
    let wrapper;

    beforeAll(() => {
      wrapper = getWrapper({
        addNotification,
        isLoggedIn: true,
        onClick,
        isUnderMinPeriod: true
      });
      instance = wrapper.instance();
      instance.handleClick(false);
    });

    afterAll(() => {
      simple.restore();
    });

    test('when isUnderMinPeriod is true', () => {
      expect(onClick.callCount).toBe(0);
      expect(addNotification.callCount).toBe(1);
      expect(addNotification.lastCall.args).toEqual([{
        message: 'Notifications.selectTimeToReserve.warning',
        type: 'info',
        timeOut: 10000,
      }]);
    });
  });

  test('when disabled is false', () => {
    const addNotification = simple.stub();
    const onClick = simple.stub();
    const wrapper = getWrapper({ addNotification, onClick });
    wrapper.instance().handleClick(false);

    expect(addNotification.callCount).toBe(0);
    expect(onClick.callCount).toBe(1);
    expect(onClick.lastCall.args).toEqual([
      {
        begin: defaultProps.slot.start,
        end: defaultProps.slot.end,
        resource: defaultProps.resource,
      },
    ]);
  });

  describe('clear button onClick when clear button is available', () => {
    let wrapper;
    let button;
    const onClear = simple.stub();

    beforeAll(() => {
      wrapper = getWrapper({ showClear: true, onClear });
      button = wrapper.find('button.app-TimeSlot__clear');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls onClear function', () => {
      expect(typeof button.prop('onClick')).toBe('function');
      button.prop('onClick')();
      expect(onClear.callCount).toBe(1);
    });
  });
});
