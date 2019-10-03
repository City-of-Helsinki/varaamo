import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../../app/utils/testUtils';
import { UnwrappedManageReservationsFilters } from '../ManageReservationsFilters';
import unit from '../../../../../common/data/fixtures/unit';

describe('ManageReservationsFilters', () => {
  test('renders correctly', () => {
    const props = {
      filters: {},
      units: [unit.build()],
      onSearchChange: jest.fn(),
      onShowOnlyFiltersChange: jest.fn(),
    };
    const wrapper = shallowWithIntl(
      <UnwrappedManageReservationsFilters {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
