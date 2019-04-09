import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationDate from './ReservationDate';

describe('shared/reservation-date/ReservationDate', () => {
  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationDate {...extraProps} />);
  }

  let wrapper;

  beforeAll(() => {
    wrapper = getWrapper({
      beginDate: '2018-01-31T13:00:00+02:00',
      endDate: '2018-01-31T13:30:00+02:00',
    });
  });

  test('renders a container div', () => {
    const container = wrapper.find('div.reservation-date');
    expect(container.length).toBe(1);
  });

  test('renders a date container div', () => {
    const container = wrapper.find('div.reservation-date__content');
    expect(container.length).toBe(1);
  });

  test('renders a month heading', () => {
    const container = wrapper.find('.reservation-date__month');
    expect(container.length).toBe(1);
  });

  test('renders a day heading', () => {
    const container = wrapper.find('h1');
    expect(container.length).toBe(1);
  });

  test('renders a day of week heading', () => {
    const container = wrapper.find('.reservation-date__day-of-week');
    expect(container.length).toBe(1);
  });

  test('renders a time heading', () => {
    const container = wrapper.find('h3');
    expect(container.length).toBe(1);
  });

  test('renders empty', () => {
    const emptyWrapper = getWrapper({});
    expect(emptyWrapper.equals(<span />)).toBe(true);
  });
});
