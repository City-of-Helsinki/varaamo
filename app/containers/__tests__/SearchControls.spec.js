import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import { UnconnectedSearchControls as SearchControls } from 'containers/SearchControls';

describe('Container: SearchControls', () => {
  const props = {
    actions: {
      changeSearchFilters: simple.stub(),
      fetchPurposes: simple.stub(),
      fetchResources: simple.stub(),
    },
    isFetchingPurposes: false,
    filters: {
      purpose: 'some-purpose',
      search: '',
    },
    purposeOptions: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
  };

  const tree = sd.shallowRender(<SearchControls {...props} />);
  const instance = tree.getMountedInstance();

  describe('rendering SearchFilters', () => {
    const searchFiltersTrees = tree.everySubTree('SearchFilters');
    const searchFiltersVdom = searchFiltersTrees[0].getRenderOutput();

    it('should render SearchFilters component', () => {
      expect(searchFiltersTrees.length).to.equal(1);
    });

    it('should pass correct props to SearchFilters component', () => {
      const actualProps = searchFiltersVdom.props;

      expect(actualProps.isFetchingPurposes).to.equal(props.isFetchingPurposes);
      expect(actualProps.onFiltersChange).to.equal(instance.onFiltersChange);
      expect(actualProps.purposeOptions).to.deep.equal(props.purposeOptions);
      expect(actualProps.filters).to.deep.equal(props.filters);
    });
  });

  describe('onFiltersChange', () => {
    const newFilters = { purpose: 'new-purpose' };

    before(() => {
      instance.onFiltersChange(newFilters);
    });

    it('should call changeSearchFilters with correct arguments', () => {
      const action = props.actions.changeSearchFilters;

      expect(action.callCount).to.equal(1);
      expect(action.lastCall.args[0]).to.deep.equal(newFilters);
    });

    it('should call fetchResources with correct arguments', () => {
      const action = props.actions.fetchResources;
      const expectedArgs = {
        search: props.filters.search,
        purpose: newFilters.purpose,
      };

      expect(action.callCount).to.equal(1);
      expect(action.lastCall.args[0]).to.deep.equal(expectedArgs);
    });
  });

  describe('fetching data', () => {
    it('should fetch resources when component mounts', () => {
      instance.componentDidMount();

      expect(props.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
