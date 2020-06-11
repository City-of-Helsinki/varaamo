import React from 'react';
import toJSON from 'enzyme-to-json';

import { UnWrappedSearchPage } from '../SearchPage';
import {
  shallowWithIntl,
  globalDateMock,
} from '../../../../../app/utils/testUtils';

describe('SearchPage', () => {
  globalDateMock();

  test('renders correctly', () => {
    const props = {
      location: {},
      history: {},
      match: { path: 'foo' },
    };

    const wrapper = shallowWithIntl(<UnWrappedSearchPage {...props} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
