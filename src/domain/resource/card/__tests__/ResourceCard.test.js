import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import { UnconnectedResourceCard } from '../ResourceCard';
import Resource from '../../../../../app/utils/fixtures/Resource';
import Unit from '../../../../../app/utils/fixtures/Unit';

describe('ResourceCard', () => {
  test('renders correctly', () => {
    const props = {
      date: '30-07-2019',
      key: 'foo',
      onFavoriteClick: jest.fn(),
      onFilterClick: jest.fn(),
      resource: Resource.build(),
      unit: Unit.build()
    };
    const wrapper = shallowWithIntl(
      <UnconnectedResourceCard {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
