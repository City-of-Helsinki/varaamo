import React from 'react';
import toJSON from 'enzyme-to-json';

import { UntranslatedSearchSort as SearchSort } from '../SearchSort';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

describe('SearchSort', () => {
  test('renders correctly', () => {
    const wrapper = shallowWithIntl(
      <SearchSort locale="en" onChange={() => null} t={jest.fn()} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
