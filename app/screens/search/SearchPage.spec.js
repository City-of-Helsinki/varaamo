import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import { getFetchParamsFromFilters } from 'utils/SearchUtils';
import { UnconnectedSearchPage as SearchPage } from './SearchPage';

describe('Container: SearchPage', () => {
  const unit = Unit.build();
  const resource = Resource.build();
  const props = {
    actions: {
      searchResources: simple.stub(),
      fetchUnits: simple.stub(),
    },
    isFetchingSearchResults: false,
    filters: {
      date: '2015-10-10',
      purpose: 'some-purpose',
    },
    location: { query: {} },
    params: {},
    results: Immutable([resource]),
    searchDone: true,
    units: Immutable({ [unit.id]: unit }),
  };
  const tree = sd.shallowRender(<SearchPage {...props} />);

  describe('rendering SearchResults', () => {
    const searchResultsTrees = tree.everySubTree('SearchResults');

    it('should render SearchResults component', () => {
      expect(searchResultsTrees.length).to.equal(1);
    });

    it('should pass correct props to SearchResults component', () => {
      const actualProps = searchResultsTrees[0].props;

      expect(actualProps.date).to.equal(props.filters.date);
      expect(actualProps.filters).to.equal(props.filters);
      expect(actualProps.isFetching).to.equal(props.isFetchingSearchResults);
      expect(actualProps.results).to.deep.equal(props.results);
      expect(actualProps.units).to.deep.equal(props.units);
    });
  });

  describe('componentDidMount', () => {
    before(() => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch resources when component mounts', () => {
      expect(props.actions.searchResources.callCount).to.equal(1);
    });

    it('should fetch resources witch correct filters', () => {
      const actual = props.actions.searchResources.lastCall.args[0];
      const expected = getFetchParamsFromFilters(props.filters);

      expect(actual).to.deep.equal(expected);
    });

    it('should fetch units when component mounts', () => {
      expect(props.actions.fetchUnits.callCount).to.equal(1);
    });
  });

  describe('componentWillUpdate', () => {
    describe('if search filters did change and url has query part', () => {
      let nextProps;

      before(() => {
        props.actions.searchResources.reset();
        const instance = tree.getMountedInstance();
        nextProps = {
          filters: { purpose: 'new-purpose' },
          url: '/search?purpose=new-purpose',
        };
        instance.componentWillUpdate(nextProps);
      });

      it('should search resources with given filters', () => {
        const actualArg = props.actions.searchResources.lastCall.args[0];

        expect(props.actions.searchResources.callCount).to.equal(1);
        expect(actualArg).to.deep.equal(nextProps.filters);
      });
    });

    describe('if search filters did not change', () => {
      let nextProps;

      before(() => {
        props.actions.searchResources.reset();
        const instance = tree.getMountedInstance();
        nextProps = {
          filters: props.filters,
          url: '/search?search=some-search',
        };
        instance.componentWillUpdate(nextProps);
      });

      it('should not do a search', () => {
        expect(props.actions.searchResources.callCount).to.equal(0);
      });
    });
  });
});
