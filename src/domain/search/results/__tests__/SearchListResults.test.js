import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { UnwrappedSearchListResults } from '../SearchListResults';
import resource from '../../../../common/data/fixtures/resource';
import unit from '../../../../common/data/fixtures/unit';
import { globalDateMock } from '../../../../../app/utils/testUtils';
import SearchSort from '../../sort/SearchSort';
import Pagination from '../../../../common/pagination/Pagination';

const findSearchSort = wrapper => wrapper.find(SearchSort);
const findPagination = wrapper => wrapper.find(Pagination);

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

  test('correctly passes pages to Pagination', () => {
    const wrapper = getWrapper({ totalCount: 67 });

    expect(findPagination(wrapper).prop('pages')).toEqual(3);
  });
});
