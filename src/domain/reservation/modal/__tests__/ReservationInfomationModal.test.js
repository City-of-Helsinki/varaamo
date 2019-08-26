import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import ReservationInformationModal from '../ReservationInformationModal';
import reservation from '../../../../common/data/fixtures/reservation';

describe('ReservationInformationModal', () => {
  test('renders correctly', () => {
    globalDateMock();
    const mockReservation = reservation.build({ begin: '2019-08-14T14:00:00+03:00', end: '2019-08-14T15:00:00+03:00' });
    const props = {
      reservation: mockReservation,
      onHide: jest.fn(),
      handleSaveComment: jest.fn(),
      isOpen: true
    };
    const wrapper = shallowWithIntl(
      <ReservationInformationModal {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
