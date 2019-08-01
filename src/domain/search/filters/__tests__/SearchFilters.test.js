import React from 'react';
import toJSON from 'enzyme-to-json';

import { ISearchFilters } from '../SearchFilters';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import unit from '../../../../common/data/fixtures/unit';
import purpose from '../../../../common/data/fixtures/purpose';


describe('ResourceMap', () => {
  test('renders correctly', () => {
    const props = {
      onChange: jest.fn(),
      onGeolocationToggle: jest.fn(),
      units: [unit.build()],
      purposes: [purpose.build()],
      filters: {}
    };
    const wrapper = shallowWithIntl(
      <ISearchFilters {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
