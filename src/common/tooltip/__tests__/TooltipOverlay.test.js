import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import TooltipOverlay from '../TooltipOverlay';

describe('TooltipOverlay', () => {
  test('renders correctly', () => {
    const wrapper = shallow(
      <TooltipOverlay content={<span>bar</span>}>
        <span>foo</span>
      </TooltipOverlay>
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
