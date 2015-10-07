import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import { UnconnectedSearchControls as SearchControls } from 'containers/SearchControls';

describe('Container: SearchControls', () => {
  const props = {
    actions: {
      changePurposeFilter: simple.stub(),
      fetchPurposes: simple.stub(),
    },
    isFetchingPurposes: false,
    purposeFilter: 'some-filter',
    purposeOptions: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
  };

  const tree = sd.shallowRender(<SearchControls {...props} />);

  describe('rendering SearchFilters', () => {
    const searchFiltersTrees = tree.everySubTree('SearchFilters');

    it('should render a SearchFilters', () => {
      expect(searchFiltersTrees.length).to.equal(1);
    });

    describe('passing props', () => {
      const searchFiltersVdom = searchFiltersTrees[0].getRenderOutput();

      it('should pass isFetchingPurposes', () => {
        expect(searchFiltersVdom.props.isFetchingPurposes).to.equal(props.isFetchingPurposes);
      });

      it('should pass changePurposeFilter as onPurposeFilterChange', () => {
        expect(searchFiltersVdom.props.onPurposeFilterChange).to.equal(props.actions.changePurposeFilter);
      });

      it('should pass purposeOptions', () => {
        expect(searchFiltersVdom.props.purposeOptions).to.deep.equal(props.purposeOptions);
      });

      it('should pass purposeFilter', () => {
        expect(searchFiltersVdom.props.purposeFilter).to.equal(props.purposeFilter);
      });
    });
  });

  describe('fetching data', () => {
    it('should fetch resources when component mounts', () => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();

      expect(props.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
