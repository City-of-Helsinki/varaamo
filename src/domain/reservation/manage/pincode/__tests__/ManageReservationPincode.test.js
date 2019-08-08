import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ManageReservationPincode from '../ManageReservationPincode';
import reservation from '../../../../../common/data/fixtures/reservation';

describe('ManageReservationPincode', () => {
  test('renders correctly', () => {
    const wrapper = shallow(
      <ManageReservationPincode reservation={reservation.build()} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
