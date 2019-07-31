import toJSON from 'enzyme-to-json';
import React from 'react';

import SearchMapToggle from '../SearchMapToggle';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

describe('SearchMapToggle', () => {
  test('renders correctly', () => {
    const wrapper = shallowWithIntl(
      <SearchMapToggle
        active="list"
        onClick={() => null}
        resultCount={53}
      />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('onClick', () => {
    const onClick = jest.fn();
    const wrapper = shallowWithIntl(
      <SearchMapToggle
        active="list"
        onClick={onClick}
        resultCount={53}
      />
    );

    wrapper.find('.app-SearchMapToggle__button-map').simulate('click');

    expect(onClick.mock.calls[0][0]).toBe('map');
  });
});
