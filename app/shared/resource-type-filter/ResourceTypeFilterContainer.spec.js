import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import ResourceTypeFilterContainer from './ResourceTypeFilterContainer';
import ResourceTypeFilterButton from './ResourceTypeFilterButton';


describe('shared/resource-type-filter/ResourceTypeFilterContainer', () => {
  const defaultProps = {
    onSelectResourceType: simple.mock(),
    onUnselectResourceType: simple.mock(),
    resourceTypes: ['a', 'b', 'c'],
    selectedResourceTypes: ['a'],
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceTypeFilterContainer {...defaultProps} {...props} />);
  }
  let wrapper;

  beforeEach(() => {
    wrapper = getWrapper();
  });

  it('renders ResourceTypeFilter components', () => {
    expect(wrapper.find(ResourceTypeFilterButton)).to.have.length(3);
  });

  describe('ResourceTypeFilter', () => {
    let resourceTypeFilter;
    beforeEach(() => {
      resourceTypeFilter = wrapper.find(ResourceTypeFilterButton).at(0);
    });

    it('passes correct props', () => {
      expect(resourceTypeFilter.prop('onClick')).to.equal(wrapper.instance().handleClick);
      expect(resourceTypeFilter.prop('resourceType')).to.equal('a');
    });

    describe('selected', () => {
      beforeEach(() => {
        resourceTypeFilter = wrapper.find(ResourceTypeFilterButton).at(0);
      });

      it('passes correct active prop', () => {
        expect(resourceTypeFilter.prop('active')).to.be.true;
      });
    });
    describe('not selected', () => {
      beforeEach(() => {
        resourceTypeFilter = wrapper.find(ResourceTypeFilterButton).at(1);
      });

      it('passes correct active prop', () => {
        expect(resourceTypeFilter.prop('active')).to.be.false;
      });
    });
  });

  describe('handleClick', () => {
    let instance;

    beforeEach(() => {
      instance = wrapper.instance();
    });

    beforeEach(() => {
      defaultProps.onSelectResourceType.reset();
      defaultProps.onUnselectResourceType.reset();
    });

    it('calls onUnselectResourceType if resource was on selected list', () => {
      instance.handleClick(defaultProps.selectedResourceTypes[0]);
      expect(defaultProps.onUnselectResourceType.callCount).to.equal(1);
      expect(defaultProps.onUnselectResourceType.lastCall.args).to.deep.equal(
        [defaultProps.selectedResourceTypes[0]]
      );
      expect(defaultProps.onSelectResourceType.callCount).to.equal(0);
    });

    it('calls onSelectResourceType if resource was not on selected list', () => {
      instance.handleClick(defaultProps.resourceTypes[-1]);
      expect(defaultProps.onSelectResourceType.callCount).to.equal(1);
      expect(defaultProps.onSelectResourceType.lastCall.args).to.deep.equal(
        [defaultProps.resourceTypes[-1]]
      );
      expect(defaultProps.onUnselectResourceType.callCount).to.equal(0);
    });
  });
});
