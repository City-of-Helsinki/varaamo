import React from 'react';
import toJSON from 'enzyme-to-json';

import SearchSort from '../SearchSort';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

describe('SearchSort', () => {
  test('renders correctly', () => {
    const wrapper = shallowWithIntl(
      <SearchSort onChange={() => null} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
