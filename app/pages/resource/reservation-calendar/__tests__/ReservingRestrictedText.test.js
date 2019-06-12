import React from 'react';

import { shallowWithIntl } from '../../../../utils/testUtils';
import ReservingRestrictedText from '../ReservingRestrictedText';

describe('pages/resource/reservation-calendar/ReservingRestrictedText', () => {
  const defaultProps = {
    reservableBefore: '2015-10-11',
    reservableDaysInAdvance: 10,
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservingRestrictedText {...defaultProps} {...extraProps} />);
  }

  test('renders a p tag', () => {
    const paragraph = getWrapper().find('p');
    expect(paragraph.length).toBe(1);
  });

  test('renders correct info text', () => {
    const text = getWrapper().find('p').text();
    expect(text).toContain('ReservingRestrictedText.reservationRestricted');
  });

  test('display the date range when reserving is possible', () => {
    const text = getWrapper().find('p').text();
    expect(text).toContain('ReservingRestrictedText.reservationAvailableBetween');
  });
});
