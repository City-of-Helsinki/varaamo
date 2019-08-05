import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { UnwrappedSearchListResults } from '../SearchListResults';
import resource from '../../../../common/data/fixtures/resource';
import unit from '../../../../common/data/fixtures/unit';

describe('SearchListResults', () => {
  test('renders correctly', () => {
    const wrapper = shallow(
      <UnwrappedSearchListResults
        history={{}}
        location={{}}
        match={{}}
        onFavoriteClick={() => null}
        onFiltersChange={() => null}
        resources={[resource.build()]}
        units={[unit.build()]}

      />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
