import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import ReservingRestrictedText from './ReservingRestrictedText';

describe('pages/resource/reservation-calendar/ReservingRestrictedText', () => {
  const defaultProps = {
    reservableBefore: '2015-10-11',
    reservableDaysInAdvance: 10,
  };

  function getWrapper(extraProps) {
    return shallow(<ReservingRestrictedText {...defaultProps} {...extraProps} />);
  }

  it('renders a p tag', () => {
    const paragraph = getWrapper().find('p');
    expect(paragraph.length).to.equal(1);
  });

  it('renders how many days in advance the reservation can be made', () => {
    const text = getWrapper().find('p').text();
    expect(text).to.contain(defaultProps.reservableDaysInAdvance);
  });

  it('renders the dates when reservation is possible', () => {
    const text = getWrapper().find('p').text();
    const today = moment().format('D.M.YYYY');
    const until = '11.10.2015';
    expect(text).to.contain(today);
    expect(text).to.contain(until);
  });
});
