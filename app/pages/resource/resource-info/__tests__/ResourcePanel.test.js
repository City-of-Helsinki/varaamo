import React from 'react';
import toJSON from 'enzyme-to-json';

import ResourcePanel from '../ResourcePanel';
import { shallowWithIntl } from '../../../../utils/testUtils';

describe('ResourcePanel', () => {
  test('renders correctly', () => {
    const props = {
      header: 'foo',
    };
    const wrapper = shallowWithIntl(
      <ResourcePanel {...props}><p>bar</p></ResourcePanel>,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
