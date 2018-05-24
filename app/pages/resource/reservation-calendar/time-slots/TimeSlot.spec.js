import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import TimeSlotFixture from 'utils/fixtures/TimeSlot';
import { shallowWithIntl } from 'utils/testUtils';
import TimeSlot from './TimeSlot';

describe('pages/resource/reservation-calendar/time-slots/TimeSlot', () => {
  const defaultProps = {
    addNotification: simple.stub(),
    isAdmin: false,
    isEditing: true,
    isLoggedIn: true,
    isSelectable: true,
    onClick: simple.stub(),
    resource: Resource.build(),
    selected: false,
    slot: Immutable(TimeSlotFixture.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<TimeSlot {...defaultProps} {...extraProps} />);
  }

  it('renders button.app-TimeSlot', () => {
    expect(getWrapper().is('button.app-TimeSlot')).to.be.true;
  });

  it('renders slot start time as button text', () => {
    const expected = moment(defaultProps.slot.start).format('HH:mm');
    expect(getWrapper().text()).to.contain(expected);
  });

  describe('button onClick when user is not logged in', () => {
    let instance;
    let wrapper;

    before(() => {
      wrapper = getWrapper({ isLoggedIn: false });
      instance = wrapper.instance();
      instance.handleClick = simple.mock();
    });

    afterEach(() => {
      instance.handleClick.reset();
    });

    after(() => {
      simple.restore();
    });

    it('calls handleClick with disabled true', () => {
      expect(wrapper.prop('onClick')).to.be.a('function');
      wrapper.prop('onClick')();
      expect(instance.handleClick.callCount).to.equal(1);
      expect(instance.handleClick.lastCall.args).to.deep.equal([true]);
    });
  });

  describe('button onClick when user is logged in', () => {
    let instance;
    let wrapper;

    before(() => {
      wrapper = getWrapper({ isLoggedIn: true });
      instance = wrapper.instance();
      instance.handleClick = simple.mock();
    });

    afterEach(() => {
      instance.handleClick.reset();
    });

    after(() => {
      simple.restore();
    });

    it('calls handleClick with disabled false', () => {
      expect(wrapper.prop('onClick')).to.be.a('function');
      wrapper.prop('onClick')();
      expect(instance.handleClick.callCount).to.equal(1);
      expect(instance.handleClick.lastCall.args).to.deep.equal([false]);
    });
  });

  describe('getReservationInfoNotification', () => {
    it('returns null when slot end in past', () => {
      const t = simple.stub();
      const slot = { end: '2016-10-11T10:00:00.000Z' };
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, {}, slot, t);

      expect(result).to.equal(null);
      expect(t.callCount).to.equal(0);
    });

    it('returns null when slot reserved', () => {
      const t = simple.stub();
      const slot = { reserved: true };
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, {}, slot, t);

      expect(result).to.equal(null);
      expect(t.callCount).to.equal(0);
    });

    it('returns message when not logged in and resource is reservable', () => {
      const message = 'some message';
      const t = simple.stub().returnWith(message);
      const resource = Resource.build({ reservable: true });
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(false, resource, defaultProps.slot, t);

      expect(t.callCount).to.equal(1);
      expect(result.message).to.equal(message);
      expect(result.type).to.equal('info');
      expect(result.timeOut).to.equal(10000);
    });

    it('returns correct message when logged in', () => {
      const t = simple.stub();
      const resource = Resource.build({ reservationInfo: 'reservation info' });
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, resource, defaultProps.slot, t);

      expect(t.callCount).to.equal(0);
      expect(result.message).to.equal(resource.reservationInfo);
      expect(result.type).to.equal('info');
      expect(result.timeOut).to.equal(10000);
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

    before(() => {
      wrapper = getWrapper({
        addNotification,
        isLoggedIn: false,
        onClick,
      });
      instance = wrapper.instance();
      simple.mock(instance, 'getReservationInfoNotification').returnWith(message);
      wrapper.instance().handleClick(true);
    });

    afterEach(() => {
      instance.getReservationInfoNotification.reset();
    });

    after(() => {
      simple.restore();
    });

    it('calls addNotification prop', () => {
      expect(onClick.callCount).to.equal(0);
      expect(instance.getReservationInfoNotification.callCount).to.equal(1);
      expect(addNotification.callCount).to.equal(1);
      expect(addNotification.lastCall.args).to.deep.equal([message]);
    });
  });

  it('when disabled is false', () => {
    const addNotification = simple.stub();
    const onClick = simple.stub();
    const wrapper = getWrapper({ addNotification, onClick });
    wrapper.instance().handleClick(false);

    expect(addNotification.callCount).to.equal(0);
    expect(onClick.callCount).to.equal(1);
    expect(onClick.lastCall.args).to.deep.equal([{
      begin: defaultProps.slot.start,
      end: defaultProps.slot.end,
      resource: defaultProps.resource.id,
    }]);
  });
});
