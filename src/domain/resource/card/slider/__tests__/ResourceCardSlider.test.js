import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { UnconnectedResourceCardSlider } from '../ResourceCardSlider';
import Resource from '../../../../../../app/utils/fixtures/Resource';
import Unit from '../../../../../../app/utils/fixtures/Unit';


describe('ResourceCardSlider', () => {
  test('renders correctly', () => {
    const props = {
      history: {},
      location: {},
      resources: [Resource.build()],
      unit: Unit.build(),
      date: '30-07-2019',
      onFavoriteClick: jest.fn(),
      onFilterClick: jest.fn()
    };
    const wrapper = shallow(
      <UnconnectedResourceCardSlider {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
