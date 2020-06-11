import React from 'react';
import toJSON from 'enzyme-to-json';

import SelectFilter from '../SelectFilter';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';

describe('SelectFilter', () => {
  test('render normally', () => {
    const props = {
      id: 'foo',
      onChange: jest.fn(),
      t: jest.fn(),
      options: [
        {
          value: 'foo',
          label: 'bar',
        },
      ],
    };
    const wrapper = shallowWithIntl(<SelectFilter {...props} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
