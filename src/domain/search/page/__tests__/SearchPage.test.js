import React from 'react';
import toJSON from 'enzyme-to-json';

import { UnconnectedSearchPage } from '../SearchPage';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

describe('SearchPage', () => {
  test('renders correctly', () => {
    const props = {
      location: {},
      history: {},
      match: { path: 'foo' }
    };
    const wrapper = shallowWithIntl(
      <UnconnectedSearchPage {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
