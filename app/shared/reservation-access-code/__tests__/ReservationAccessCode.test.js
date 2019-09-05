import React from 'react';
import Immutable from 'seamless-immutable';
import { shallow } from 'enzyme';

import Reservation from '../../../utils/fixtures/Reservation';
import Resource from '../../../utils/fixtures/Resource';
import ReservationAccessCode from '../ReservationAccessCode';

describe('shared/reservation-access-code/ReservationAccessCode', () => {
  const createReservation = attributes => Immutable(Reservation.build(attributes));
  const createResource = attributes => Immutable(Resource.build(attributes));

  const defaultProps = {
    reservation: createReservation(),
    resource: createResource({ generateAccessCodes: true }),
  };

  function getWrapper(extraProps) {
    return shallow(<ReservationAccessCode {...defaultProps} {...extraProps} />);
  }

  test('renders GeneratedAccessCode when PIN is available', () => {
    const reservation = createReservation({ accessCode: '1232' });
    const wrapper = getWrapper({ reservation });
    expect(wrapper.name()).toContain('GeneratedAccessCode');
  });

  test('renders PendingAccessCode when PIN is pending', () => {
    const resource = createResource({ generateAccessCodes: false });
    const wrapper = getWrapper({ resource });
    expect(wrapper.name()).toContain('PendingAccessCode');
  });

  test('renders empty span when PIN is not available and it won\'t be generated either', () => {
    const wrapper = getWrapper();
    expect(wrapper.equals(<span />)).toBe(true);
  });

  test('renders empty span when reservation that would produce pending PIN is cancelled', () => {
    const reservation = createReservation({ state: 'cancelled' });
    const resource = createResource({ generateAccessCodes: false });
    const wrapper = getWrapper({ reservation, resource });
    expect(wrapper.equals(<span />)).toBe(true);
  });
});
