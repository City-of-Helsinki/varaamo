import { shallow } from 'enzyme';
import React from 'react';

import GroupInfo from './GroupInfo';
import Sidebar from './Sidebar';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    groups: [],
  };
  return shallow(<Sidebar {...defaults} {...props} />);
}

describe('shared/availability-view/Sidebar', () => {
  test('renders a div.sidebar', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.sidebar')).toBe(true);
  });

  test('renders no groups if none given', () => {
    const elements = getWrapper({ groups: [] }).find(GroupInfo);
    expect(elements).toHaveLength(0);
  });

  test('renders groups', () => {
    const date = '2016-05-05';
    const groups = [
      { name: 'A', resources: [] },
      { name: 'B', resources: ['a', 'b'] },
    ];
    const elements = getWrapper({ date, groups }).find(GroupInfo);
    expect(elements).toHaveLength(2);
    expect(elements.at(0).prop('date')).toBe(date);
    expect(elements.at(0).prop('name')).toBe(groups[0].name);
    expect(elements.at(0).prop('resources')).toBe(groups[0].resources);
    expect(elements.at(1).prop('date')).toBe(date);
    expect(elements.at(1).prop('name')).toBe(groups[1].name);
    expect(elements.at(1).prop('resources')).toBe(groups[1].resources);
  });
});
