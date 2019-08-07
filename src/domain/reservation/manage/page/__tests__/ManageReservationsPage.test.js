import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../../app/utils/testUtils';
import { UnwrappedManageReservationsPage } from '../ManageReservationsPage';

describe('ManageReservationsPage', () => {
  test('renders correctly', () => {
    const props = {
      location: { search: '' },
    };
    const wrapper = shallowWithIntl(
      <UnwrappedManageReservationsPage {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
