import React from 'react';
import toJSON from 'enzyme-to-json';

import ToggleFilter from '../ToggleFilter';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';


describe('ToggleFilter', () => {
  test('render normally', () => {
    const props = {
      id: 'foo',
      label: 'bar',
      onChange: jest.fn(),
    };
    const wrapper = shallowWithIntl(
      <ToggleFilter {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
