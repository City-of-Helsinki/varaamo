import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import SearchMapResults from '../SearchMapResults';
import resource from '../../../../common/data/fixtures/resource';
import unit from '../../../../common/data/fixtures/unit';

describe('SearchMapResults', () => {
  test('renders correctly', () => {
    const wrapper = shallow(
      <SearchMapResults
        onFavoriteClick={() => null}
        onFiltersChange={() => null}
        resources={[resource.build()]}
        units={[unit.build()]}
      />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
