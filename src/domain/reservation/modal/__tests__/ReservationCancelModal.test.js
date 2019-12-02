import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import { UnconnectedReservationCancelModal } from '../ReservationCancelModal';
import reservation from '../../../../common/data/fixtures/reservation';

describe('domain/reservation/modal/ReservationCancelModal', () => {
  test('renders correctly', () => {
    globalDateMock();
    const mockReservation = reservation.build({ begin: '2019-08-14T14:00:00+03:00', end: '2019-08-14T15:00:00+03:00' });
    const mockBoolean = true;
    const extraProps = {
      t: jest.fn(),
      userId: 'foo',
      users: { bar: 'bar' }
    };
    const props = {
      onEditReservation: jest.fn(),
      parentToggle: jest.fn(),
      reservation: mockReservation,
      toggleShow: mockBoolean
    };
    const wrapper = shallowWithIntl(
      <UnconnectedReservationCancelModal {...props} {...extraProps} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
