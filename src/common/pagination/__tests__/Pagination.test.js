import toJSON from 'enzyme-to-json';
import React from 'react';

import Pagination from '../Pagination';
import { shallowWithIntl } from '../../../../app/utils/testUtils';

describe('Pagination', () => {
  test('renders correctly', () => {
    const wrapper = shallowWithIntl(
      <Pagination
        onChange={() => null}
        page={1}
        pages={10}
      />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('onChange', () => {
    const onChange = jest.fn();
    const wrapper = shallowWithIntl(
      <Pagination
        onChange={onChange}
        page={2}
        pages={10}
      />,
    );

    wrapper.find('.app-SearchPagination__prev').simulate('click');
    wrapper.find('.app-SearchPagination__page-3').simulate('click');
    wrapper.find('.app-SearchPagination__next').simulate('click');

    expect(onChange.mock.calls.length).toBe(3);
    expect(onChange.mock.calls[0][0]).toBe(1);
    expect(onChange.mock.calls[1][0]).toBe(3);
    expect(onChange.mock.calls[2][0]).toBe(3);
  });
});
