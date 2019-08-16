import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import ReservationInfomationModal from '../ReservationInfomationModal';
import reservation from '../../../../common/data/fixtures/reservation';

describe('ReservationInfomationModal', () => {
  test('renders correctly', () => {
    globalDateMock();
    const mockReservation = reservation.build({ begin: '2019-08-14T14:00:00+03:00', end: '2019-08-14T15:00:00+03:00' });
    const props = {
      reservation: mockReservation,
      onHide: jest.fn(),
      isOpen: true
    };
    const wrapper = shallowWithIntl(
      <ReservationInfomationModal {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
