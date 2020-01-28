import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../../app/utils/testUtils';
import { UnwrappedManageReservationsList } from '../ManageReservationsList';
import reservation from '../../../../../common/data/fixtures/reservation';
import unit from '../../../../../common/data/fixtures/unit';

describe('ManageReservationsList', () => {
  test('renders correctly', () => {
    const props = {
      reservations: [reservation.build()],
      unit: [unit.build()],
    };
    const wrapper = shallowWithIntl(
      <UnwrappedManageReservationsList {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
