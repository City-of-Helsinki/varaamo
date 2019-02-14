import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import ResourceTypeFilterButton from './ResourceTypeFilterButton';

describe('shared/resource-type-filter/ResourceTypeFilterButton', () => {
  const defaultProps = {
    active: true,
    onClick: simple.mock(),
    resourceType: 'room'
  };

  function getWrapper(props) {
    return shallow(<ResourceTypeFilterButton {...defaultProps} {...props} />);
  }
  let wrapper;

  before(() => {
    wrapper = getWrapper();
  });

  it('is a button', () => {
    expect(wrapper.is(Button)).to.be.true;
  });

  it('has primary bsStyle if active prop is true', () => {
    expect(wrapper.prop('bsStyle')).to.equal('primary');
  });

  it('has default bsStyle if active prop is false', () => {
    expect(getWrapper({ active: false }).prop('bsStyle')).to.equal('default');
  });

  it('passes onClick prop with correct args', () => {
    wrapper.prop('onClick')();
    expect(defaultProps.onClick.lastCall.args).to.deep.equal([defaultProps.resourceType]);
  });

  it('renders resource type name', () => {
    expect(wrapper.children().text()).to.equal(defaultProps.resourceType);
  });
});
