import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';
import Immutable from 'seamless-immutable';

import DateHeader from 'shared/date-header';
import { UnconnectedSearchPage as SearchPage } from './SearchPage';
import SearchControls from './controls';
import SearchResults from './results';

describe('pages/search/SearchPage', () => {
  const defaultProps = {
    actions: {
      changeSearchFilters: simple.stub(),
      fetchUnits: simple.stub(),
      searchResources: simple.stub(),
    },
    isFetchingSearchResults: false,
    filters: {
      date: '2015-10-10',
      purpose: 'some-purpose',
    },
    location: { query: {} },
    params: {},
    searchDone: true,
    searchResultIds: Immutable(['resource-1', 'resource-2']),
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

        expect(searchResults.props().isFetching).to.equal(extraProps.isFetchingSearchResults);
        expect(searchResults.props().searchResultIds).to.deep.equal(defaultProps.searchResultIds);
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

        expect(searchResults.props().isFetching).to.equal(extraProps.isFetchingSearchResults);
        expect(searchResults.props().searchResultIds).to.deep.equal(defaultProps.searchResultIds);
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

      it('fetches resources witch correct filters', () => {
        const actual = defaultProps.actions.searchResources.lastCall.args[0];
        expect(actual).to.deep.equal(defaultProps.filters);
      });

      it('fetches units when component mounts', () => {
        expect(defaultProps.actions.fetchUnits.callCount).to.equal(1);
      });
    });

    describe('componentWillUpdate', () => {
      describe('if search filters did change and url has query part', () => {
        let nextProps;

        before(() => {
          defaultProps.actions.changeSearchFilters.reset();
          defaultProps.actions.searchResources.reset();
          const instance = getWrapper().instance();
          nextProps = {
            filters: { purpose: 'new-purpose' },
            url: '/search?purpose=new-purpose',
          };
          instance.componentWillUpdate(nextProps);
        });

        it('updates search filters in state with the new filters', () => {
          const actualArg = defaultProps.actions.changeSearchFilters.lastCall.args[0];

          expect(defaultProps.actions.changeSearchFilters.callCount).to.equal(1);
          expect(actualArg).to.deep.equal(nextProps.filters);
        });

        it('searches resources with given filters', () => {
          const actualArg = defaultProps.actions.searchResources.lastCall.args[0];

          expect(defaultProps.actions.searchResources.callCount).to.equal(1);
          expect(actualArg).to.deep.equal(nextProps.filters);
        });
      });

      describe('if search filters did not change', () => {
        let nextProps;

        before(() => {
          defaultProps.actions.changeSearchFilters.reset();
          defaultProps.actions.searchResources.reset();
          const instance = getWrapper().instance();
          nextProps = {
            filters: defaultProps.filters,
            url: '/search?search=some-search',
          };
          instance.componentWillUpdate(nextProps);
        });

        it('does not update search filters in state', () => {
          expect(defaultProps.actions.changeSearchFilters.callCount).to.equal(0);
        });

        it('does not do a search', () => {
          expect(defaultProps.actions.searchResources.callCount).to.equal(0);
        });
      });
    });
  });
});
