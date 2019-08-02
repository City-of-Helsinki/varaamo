import React from 'react';
import toJSON from 'enzyme-to-json';

import SearchPage from '../SearchPage';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

describe('SearchPage', () => {
  test('renders correctly', () => {
    const wrapper = shallowWithIntl(
      <SearchPage />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
