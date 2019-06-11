import { shallow } from 'enzyme';
import React from 'react';

import GroupInfo from '../GroupInfo';
import ResourceInfoContainer from '../resource-info/ResourceInfoContainer';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    name: 'Group name',
    resources: [],
  };
  return shallow(<GroupInfo {...defaults} {...props} />);
}

describe('shared/availability-view/group-info/GroupInfo', () => {
  test('renders a div.group-info', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.group-info')).toBe(true);
  });

  test('renders name', () => {
    const name = 'Aleksanterinkatu 20';
    const element = getWrapper({ name }).find('.group-name');
    expect(element).toHaveLength(1);
    expect(element.text()).toBe(name);
  });

  test('renders no resources if none given', () => {
    const elements = getWrapper({ resources: [] }).find(ResourceInfoContainer);
    expect(elements).toHaveLength(0);
  });

  test('renders given resources', () => {
    const date = '2016-05-02';
    const resources = ['abcd', 'efgh'];
    const elements = getWrapper({ date, resources }).find(ResourceInfoContainer);
    expect(elements).toHaveLength(2);
    expect(elements.at(0).prop('date')).toBe(date);
    expect(elements.at(0).prop('id')).toBe(resources[0]);
    expect(elements.at(1).prop('date')).toBe(date);
    expect(elements.at(1).prop('id')).toBe(resources[1]);
  });
});
