import React from 'react';
import toJSON from 'enzyme-to-json';

import { UntranslatedManageReservationsDropdown as ManageReservationsDropdown } from '../ManageReservationsDropdown';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';
import reservation from '../../../../../common/data/fixtures/reservation';

describe('ManageReservationsDropdown', () => {
  test('renders correctly', () => {
    const wrapper = shallowWithIntl(
      <ManageReservationsDropdown reservation={reservation.build()} t={() => 'foo'} />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
