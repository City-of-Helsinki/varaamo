import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../../app/utils/testUtils';
import ManageReservationsStatus from '../ManageReservationsStatus';
import reservation from '../../../../../common/data/fixtures/reservation';

describe('ManageReservationsStatus', () => {
  test('renders correctly', () => {
    const props = {
      reservation: reservation.build(),
    };
    const wrapper = shallowWithIntl(
      <ManageReservationsStatus {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
