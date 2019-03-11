import React from 'react';
import Immutable from 'seamless-immutable';

import Reservation from 'utils/fixtures/Reservation';
import { shallowWithIntl } from 'utils/testUtils';
import ReservationAccessCode from './ReservationAccessCode';

describe('shared/reservation-access-code/ReservationAccessCode', () => {
  const defaultProps = {
    reservation: Immutable(Reservation.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationAccessCode {...defaultProps} {...extraProps} />);
  }

  describe('if reservation has accessCode', () => {
    const accessCode = '1234';
    const reservation = Immutable(Reservation.build({ accessCode }));

    test('renders a span with correct class', () => {
      const span = getWrapper({ reservation }).find('span');
      expect(span.length).toBe(1);
      expect(span.prop('className')).toBe('reservation-access-code');
    });

    test('renders the reservation access code', () => {
      const content = getWrapper({ reservation }).text();
      expect(content).toContain(accessCode);
    });

    test('renders text given in props', () => {
      const text = 'Some text';
      const content = getWrapper({ reservation, text }).text();
      expect(content).toContain(text);
    });

    test('renders default text if no text is given in props', () => {
      const content = getWrapper({ reservation }).text();
      expect(content).toContain('ReservationAccessCode.defaultText');
    });
  });

  describe('if reservation does not have an access code', () => {
    const accessCode = null;

    test('renders an empty span', () => {
      const reservation = Immutable(Reservation.build({ accessCode }));
      const wrapper = getWrapper({ reservation });
      expect(wrapper.equals(<span />)).toBe(true);
    });
  });
});
