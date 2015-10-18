import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import { UnconnectedSearchPage as SearchPage } from 'containers/SearchPage';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import { getFetchParamsFromFilters } from 'utils/SearchUtils';

describe('Container: SearchPage', () => {
  const unit = Unit.build();
  const resource = Resource.build();
  const props = {
    actions: {
      fetchResources: simple.stub(),
      fetchUnits: simple.stub(),
    },
    isFetchingSearchResults: false,
    filters: {
      date: '2015-10-10',
      purpose: 'some-purpose',
    },
    results: Immutable([resource]),
    units: Immutable({ [unit.id]: unit }),
  };
  const tree = sd.shallowRender(<SearchPage {...props} />);

  describe('rendering SearchResults', () => {
    const searchResultsTrees = tree.everySubTree('SearchResults');

    it('should render SearchResults component', () => {
      expect(searchResultsTrees.length).to.equal(1);
    });

    it('should pass correct props to SearchResults component', () => {
      const searchResultsVdom = searchResultsTrees[0].getRenderOutput();
      const actualProps = searchResultsVdom.props;

      expect(actualProps.isFetching).to.equal(props.isFetchingSearchResults);
      expect(actualProps.results).to.deep.equal(props.results);
      expect(actualProps.units).to.deep.equal(props.units);
    });
  });

  describe('fetching data', () => {
    before(() => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch resources when component mounts', () => {
      expect(props.actions.fetchResources.callCount).to.equal(1);
    });

    it('should fetch resources witch correct filters', () => {
      const actual = props.actions.fetchResources.lastCall.args[0];
      const expected = getFetchParamsFromFilters(props.filters);

      expect(actual).to.deep.equal(expected);
    });

    it('should fetch units when component mounts', () => {
      expect(props.actions.fetchUnits.callCount).to.equal(1);
    });
  });
});
