import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { UnconnectedResourceCardSlider } from '../ResourceCardSlider';
import unit from '../../../../../common/data/fixtures/unit';
import resource from '../../../../../common/data/fixtures/resource';


describe('ResourceCardSlider', () => {
  test('renders correctly', () => {
    const props = {
      history: {},
      location: {},
      resources: [resource.build()],
      unit: unit.build(),
      date: '30-07-2019',
      onFavoriteClick: jest.fn(),
      onFilterClick: jest.fn(),
    };
    const wrapper = shallow(
      <UnconnectedResourceCardSlider {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
