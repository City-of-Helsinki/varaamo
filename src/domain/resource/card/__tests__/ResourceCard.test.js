import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import { UnconnectedResourceCard } from '../ResourceCard';
import unit from '../../../../common/data/fixtures/unit';
import resource from '../../../../common/data/fixtures/resource';

describe('ResourceCard', () => {
  test('renders correctly', () => {
    const props = {
      date: '30-07-2019',
      key: 'foo',
      onFavoriteClick: jest.fn(),
      onFilterClick: jest.fn(),
      resource: resource.build(),
      unit: unit.build(),
      t: () => {},
    };
    const wrapper = shallowWithIntl(<UnconnectedResourceCard {...props} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
