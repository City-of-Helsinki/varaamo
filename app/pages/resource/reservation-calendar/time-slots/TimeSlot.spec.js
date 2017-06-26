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
});
