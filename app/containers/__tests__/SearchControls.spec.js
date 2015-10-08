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
      fetchResources: simple.stub(),
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
    const searchFiltersVdom = searchFiltersTrees[0].getRenderOutput();

    it('should render SearchFilters component', () => {
      expect(searchFiltersTrees.length).to.equal(1);
    });

    it('should pass correct props to SearchFilters component', () => {
      const actualProps = searchFiltersVdom.props;

      expect(actualProps.isFetchingPurposes).to.equal(props.isFetchingPurposes);
      expect(typeof actualProps.onPurposeFilterChange).to.equal('function');
      expect(actualProps.purposeOptions).to.deep.equal(props.purposeOptions);
      expect(actualProps.purposeFilter).to.equal(props.purposeFilter);
    });

    describe('passed property onPurposeFilterChange', () => {
      it('should fire correct actions when called', () => {
        searchFiltersVdom.props.onPurposeFilterChange('some-filter');

        expect(props.actions.changePurposeFilter.callCount).to.equal(1);
        expect(props.actions.fetchResources.callCount).to.equal(1);
      });

      it('should pass correct params to the fired actions', () => {
        searchFiltersVdom.props.onPurposeFilterChange('some-filter');
        const actual = props.actions.fetchResources.lastCall.args[0];
        const expected = { purpose: 'some-filter' };

        expect(actual).to.deep.equal(expected);
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
