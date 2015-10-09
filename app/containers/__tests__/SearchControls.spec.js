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
    filters: { purpose: 'some-purpose' },
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
      expect(typeof actualProps.onFiltersChange).to.equal('function');
      expect(actualProps.purposeOptions).to.deep.equal(props.purposeOptions);
      expect(actualProps.filters).to.deep.equal(props.filters);
    });

    describe('passed property onFiltersChange', () => {
      it('should fire correct actions when called', () => {
        searchFiltersVdom.props.onFiltersChange({ purpose: 'new-purpose' });

        expect(props.actions.changeSearchFilters.callCount).to.equal(1);
        expect(props.actions.fetchResources.callCount).to.equal(1);
      });

      it('should pass correct params to the fired actions', () => {
        searchFiltersVdom.props.onFiltersChange({ purpose: 'new-purpose' });
        const actual = props.actions.changeSearchFilters.lastCall.args[0];
        const expected = { purpose: 'new-purpose' };

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
