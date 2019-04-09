import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import ResourceTypeFilterButton from './ResourceTypeFilterButton';

describe('shared/resource-type-filter/ResourceTypeFilterButton', () => {
  const defaultProps = {
    active: true,
    onClick: simple.mock(),
    resourceType: 'room',
  };

  function getWrapper(props) {
    return shallow(<ResourceTypeFilterButton {...defaultProps} {...props} />);
  }
  let wrapper;

  beforeAll(() => {
    wrapper = getWrapper();
  });

  test('is a button', () => {
    expect(wrapper.is(Button)).toBe(true);
  });

  test('has primary bsStyle if active prop is true', () => {
    expect(wrapper.prop('bsStyle')).toBe('primary');
  });

  test('has default bsStyle if active prop is false', () => {
    expect(getWrapper({ active: false }).prop('bsStyle')).toBe('default');
  });

  test('passes onClick prop with correct args', () => {
    wrapper.prop('onClick')();
    expect(defaultProps.onClick.lastCall.args).toEqual([defaultProps.resourceType]);
  });

  test('renders resource type name', () => {
    expect(wrapper.children().text()).toBe(defaultProps.resourceType);
  });
});
