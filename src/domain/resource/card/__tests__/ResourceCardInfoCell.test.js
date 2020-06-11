import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import ResourceCardInfoCell from '../ResourceCardInfoCell';

describe('ResourceCardInfoCell', () => {
  test('renders correctly', () => {
    const wrapper = shallowWithIntl(<ResourceCardInfoCell />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
