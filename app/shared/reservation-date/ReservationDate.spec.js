import { expect } from 'chai';
import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationDate from './ReservationDate';

describe('shared/reservation-date/ReservationDate', () => {
  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationDate {...extraProps} />);
  }

  let wrapper;

  before(() => {
    wrapper = getWrapper({
      beginDate: '2018-01-31T13:00:00+02:00',
      endDate: '2018-01-31T13:30:00+02:00',
    });
  });

  it('renders a container div', () => {
    const container = wrapper.find('div.reservation-date');
    expect(container.length).to.equal(1);
  });

  it('renders a date container div', () => {
    const container = wrapper.find('div.reservation-date__content');
    expect(container.length).to.equal(1);
  });

  it('renders a month heading', () => {
    const container = wrapper.find('.reservation-date__month');
    expect(container.length).to.equal(1);
  });

  it('renders a day heading', () => {
    const container = wrapper.find('h1');
    expect(container.length).to.equal(1);
  });

  it('renders a day of week heading', () => {
    const container = wrapper.find('.reservation-date__day-of-week');
    expect(container.length).to.equal(1);
  });

  it('renders a time heading', () => {
    const container = wrapper.find('h3');
    expect(container.length).to.equal(1);
  });

  it('renders empty', () => {
    const emptyWrapper = getWrapper({});
    expect(emptyWrapper.equals(<span />)).to.be.true;
  });
});
