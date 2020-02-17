import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { UnwrappedSearchListResults } from '../SearchListResults';
import resource from '../../../../common/data/fixtures/resource';
import unit from '../../../../common/data/fixtures/unit';
import { globalDateMock } from '../../../../../app/utils/testUtils';
import SearchSort from '../../sort/SearchSort';

const findSearchSort = wrapper => wrapper.find(SearchSort);

describe('SearchListResults', () => {
  globalDateMock();

  const defaultProps = {
    history: {},
    location: {},
    match: {},
    onFavoriteClick: () => null,
    onFiltersChange: () => null,
    resources: [resource.build()],
    units: [unit.build()],
  };
  const getWrapper = props => shallow(
    <UnwrappedSearchListResults {...defaultProps} {...props} />,
  );
  test('renders correctly', () => {
    const wrapper = getWrapper();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('correctly passes orderBy to SearchSort', () => {
    const orderBy = 'value';
    const location = { search: `?orderBy=${orderBy}` };
    const wrapper = getWrapper({ location });

    expect(findSearchSort(wrapper).prop('value')).toEqual(orderBy);
  });
});
