import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import UnitMarker from '../UnitMarker';

describe('UnitMarker', () => {
  const unit = {
    id: 'testUnit',
    location: {
      coordinates: [24.975634, 60.20843],
    },
  };

  test('renders correctly', () => {
    const wrapper = shallow(
      <UnitMarker
        resources={[{ id: 'foo' }]}
        unit={unit}
      />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('show number of resources when more than 1 resources', () => {
    const wrapper = shallow(
      <UnitMarker
        resources={[
          { id: 'foo' },
          { id: 'bar' },
        ]}
        unit={unit}
      />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('onClick function works', () => {
    const onClick = jest.fn();
    const wrapper = shallow(
      <UnitMarker
        onClick={onClick}
        resources={[
          { id: 'foo' },
        ]}
        unit={unit}
      />,
    );

    wrapper
      .simulate('click');

    expect(onClick.mock.calls.length).toBe(1);
    expect(onClick.mock.calls[0][0].id).toBe('testUnit');
    expect(onClick.mock.calls[0][1][0].id).toBe('foo');
  });
});
