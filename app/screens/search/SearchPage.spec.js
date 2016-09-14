import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import DateHeader from 'screens/shared/date-header';
import { getFetchParamsFromFilters } from 'utils/SearchUtils';
import { UnconnectedSearchPage as SearchPage } from './SearchPage';
import SearchControls from './controls/SearchControls';
import SearchResults from './results';

describe('screens/search/SearchPage', () => {
  const unit = Unit.build();
  const resource = Resource.build();
  const defaultProps = {
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

  function getWrapper(extraProps) {
    return shallow(<SearchPage {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    describe('when no search is done', () => {
      const extraProps = {
        isFetchingSearchResults: false,
        searchDone: false,
      };

      it('renders SearchControls with correct props', () => {
        const searchControls = getWrapper(extraProps).find(SearchControls);

        expect(searchControls.length).to.equal(1);
        expect(searchControls.props().location).to.deep.equal(defaultProps.location);
        expect(searchControls.props().params).to.deep.equal(defaultProps.params);
        expect(typeof searchControls.props().scrollToSearchResults).to.equal('function');
      });

      it('does not render DateHeader', () => {
        const dateHeader = getWrapper(extraProps).find(DateHeader);

        expect(dateHeader.length).to.equal(0);
      });

      it('does not render SearchResults', () => {
        const searchResults = getWrapper(extraProps).find(SearchResults);

        expect(searchResults.length).to.equal(0);
      });

      it('renders help text', () => {
        const helpText = getWrapper(extraProps).find('.help-text');

        expect(helpText.length).to.equal(1);
      });
    });

    describe('when search results are being fetched', () => {
      const extraProps = {
        isFetchingSearchResults: true,
        searchDone: false,
      };

      it('renders SearchControls with correct props', () => {
        const searchControls = getWrapper(extraProps).find(SearchControls);

        expect(searchControls.length).to.equal(1);
        expect(searchControls.props().location).to.deep.equal(defaultProps.location);
        expect(searchControls.props().params).to.deep.equal(defaultProps.params);
        expect(typeof searchControls.props().scrollToSearchResults).to.equal('function');
      });

      it('does not render DateHeader', () => {
        const dateHeader = getWrapper(extraProps).find(DateHeader);

        expect(dateHeader.length).to.equal(0);
      });

      it('renders SearchResults with correct props', () => {
        const searchResults = getWrapper(extraProps).find(SearchResults);

        expect(searchResults.props().date).to.equal(defaultProps.filters.date);
        expect(searchResults.props().isFetching).to.equal(extraProps.isFetchingSearchResults);
        expect(searchResults.props().results).to.deep.equal(defaultProps.results);
        expect(searchResults.props().units).to.deep.equal(defaultProps.units);
      });

      it('does not render help text', () => {
        const helpText = getWrapper(extraProps).find('.help-text');

        expect(helpText.length).to.equal(0);
      });
    });

    describe('when search results have been fetched', () => {
      const extraProps = {
        isFetchingSearchResults: false,
        searchDone: true,
      };

      it('renders SearchControls with correct props', () => {
        const searchControls = getWrapper(extraProps).find(SearchControls);

        expect(searchControls.length).to.equal(1);
        expect(searchControls.props().location).to.deep.equal(defaultProps.location);
        expect(searchControls.props().params).to.deep.equal(defaultProps.params);
        expect(typeof searchControls.props().scrollToSearchResults).to.equal('function');
      });

      it('renders DateHeader with correct props', () => {
        const dateHeader = getWrapper(extraProps).find(DateHeader);

        expect(dateHeader.length).to.equal(1);
        expect(dateHeader.props().date).to.equal(defaultProps.filters.date);
      });

      it('renders SearchResults with correct props', () => {
        const searchResults = getWrapper(extraProps).find(SearchResults);

        expect(searchResults.props().date).to.equal(defaultProps.filters.date);
        expect(searchResults.props().isFetching).to.equal(extraProps.isFetchingSearchResults);
        expect(searchResults.props().results).to.deep.equal(defaultProps.results);
        expect(searchResults.props().units).to.deep.equal(defaultProps.units);
      });

      it('does not render help text', () => {
        const helpText = getWrapper(extraProps).find('.help-text');

        expect(helpText.length).to.equal(0);
      });
    });
  });

  describe('lifecycle events', () => {
    describe('componentDidMount', () => {
      before(() => {
        const instance = getWrapper().instance();
        instance.componentDidMount();
      });

      it('fetches resources when component mounts', () => {
        expect(defaultProps.actions.searchResources.callCount).to.equal(1);
      });

      it('should fetch resources witch correct filters', () => {
        const actual = defaultProps.actions.searchResources.lastCall.args[0];
        const expected = getFetchParamsFromFilters(defaultProps.filters);

        expect(actual).to.deep.equal(expected);
      });

      it('should fetch units when component mounts', () => {
        expect(defaultProps.actions.fetchUnits.callCount).to.equal(1);
      });
    });

    describe('componentWillUpdate', () => {
      describe('if search filters did change and url has query part', () => {
        let nextProps;

        before(() => {
          defaultProps.actions.searchResources.reset();
          const instance = getWrapper().instance();
          nextProps = {
            filters: { purpose: 'new-purpose' },
            url: '/search?purpose=new-purpose',
          };
          instance.componentWillUpdate(nextProps);
        });

        it('should search resources with given filters', () => {
          const actualArg = defaultProps.actions.searchResources.lastCall.args[0];

          expect(defaultProps.actions.searchResources.callCount).to.equal(1);
          expect(actualArg).to.deep.equal(nextProps.filters);
        });
      });

      describe('if search filters did not change', () => {
        let nextProps;

        before(() => {
          defaultProps.actions.searchResources.reset();
          const instance = getWrapper().instance();
          nextProps = {
            filters: defaultProps.filters,
            url: '/search?search=some-search',
          };
          instance.componentWillUpdate(nextProps);
        });

        it('should not do a search', () => {
          expect(defaultProps.actions.searchResources.callCount).to.equal(0);
        });
      });
    });
  });
});
