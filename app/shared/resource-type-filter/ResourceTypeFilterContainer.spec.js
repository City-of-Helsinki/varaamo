import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import ResourceTypeFilterContainer from './ResourceTypeFilterContainer';
import ResourceTypeFilterButton from './ResourceTypeFilterButton';


describe('shared/resource-type-filter/ResourceTypeFilterContainer', () => {
  const defaultProps = {
    onFilterResourceType: simple.mock(),
    onUnfilterResourceType: simple.mock(),
    resourceTypes: ['a', 'b', 'c'],
    filteredResourceTypes: ['a'],
  };

  function getWrapper(props) {
    return shallow(<ResourceTypeFilterContainer {...defaultProps} {...props} />);
  }
  let wrapper;

  before(() => {
    wrapper = getWrapper();
  });

  it('renders ResourceTypeFilter components', () => {
    expect(wrapper.children()).to.have.length(3);
    expect(wrapper.childAt(0).is(ResourceTypeFilterButton)).to.be.true;
  });

  describe('ResourceTypeFilter', () => {
    let resourceTypeFilter;
    before(() => {
      resourceTypeFilter = wrapper.childAt(0);
    });

    it('passes correct props', () => {
      expect(resourceTypeFilter.prop('onClick')).to.equal(wrapper.instance().handleClick);
      expect(resourceTypeFilter.prop('resourceType')).to.equal('a');
    });

    describe('filtered', () => {
      before(() => {
        resourceTypeFilter = wrapper.childAt(0);
      });

      it('passes correct active prop', () => {
        expect(resourceTypeFilter.prop('active')).to.be.false;
      });
    });
    describe('not filtered', () => {
      before(() => {
        resourceTypeFilter = wrapper.childAt(1);
      });

      it('passes correct active prop', () => {
        expect(resourceTypeFilter.prop('active')).to.be.true;
      });
    });
  });

  describe('handleClick', () => {
    let instance;

    before(() => {
      instance = wrapper.instance();
    });

    beforeEach(() => {
      defaultProps.onFilterResourceType.reset();
      defaultProps.onUnfilterResourceType.reset();
    });

    it('calls onUnfilterResourceType if resource was on filtered list', () => {
      instance.handleClick(defaultProps.filteredResourceTypes[0]);
      expect(defaultProps.onUnfilterResourceType.callCount).to.equal(1);
      expect(defaultProps.onUnfilterResourceType.lastCall.args).to.deep.equal(
        [defaultProps.filteredResourceTypes[0]]
      );
      expect(defaultProps.onFilterResourceType.callCount).to.equal(0);
    });

    it('calls onFilterResourceType if resource was not on filtered list', () => {
      instance.handleClick(defaultProps.resourceTypes[-1]);
      expect(defaultProps.onFilterResourceType.callCount).to.equal(1);
      expect(defaultProps.onFilterResourceType.lastCall.args).to.deep.equal(
        [defaultProps.resourceTypes[-1]]
      );
      expect(defaultProps.onUnfilterResourceType.callCount).to.equal(0);
    });
  });
});
