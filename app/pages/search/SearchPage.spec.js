import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import Immutable from 'seamless-immutable';

import PageWrapper from 'pages/PageWrapper';
import ResourceMap from 'shared/resource-map';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedSearchPage as SearchPage } from './SearchPage';
import SearchControls from './controls';
import SearchResults from './results';

describe('pages/search/SearchPage', () => {
  const defaultProps = {
    actions: {
      changeSearchFilters: simple.stub(),
      fetchUnits: simple.stub(),
      searchResources: simple.stub(),
      toggleMap: () => {},
    },
    isLoggedIn: false,
    isFetchingSearchResults: false,
    filters: {
      date: '2015-10-10',
      purpose: 'some-purpose',
    },
    location: { query: {} },
    params: {},
    searchDone: true,
    searchResultIds: Immutable(['resource-1', 'resource-2']),
    selectedUnitId: '123',
    showMap: false,
    uiFilters: {
      date: '2015-10-10',
      purpose: 'some-purpose',
    },
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<SearchPage {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('className')).to.equal('app-SearchPage');
      expect(pageWrapper.prop('fluid')).to.be.true;
      expect(pageWrapper.prop('title')).to.equal('SearchPage.title');
    });

    it('renders a ResourceMap with correct props', () => {
      const resourceMap = getWrapper().find(ResourceMap);
      expect(resourceMap).to.have.length(1);
      expect(resourceMap.prop('showMap')).to.equal(false);
      expect(resourceMap.prop('resourceIds')).to.deep.equal(defaultProps.searchResultIds);
      expect(resourceMap.prop('selectedUnitId')).to.equal(defaultProps.selectedUnitId);
    });

    it('passes showMap prop to ResourceMap', () => {
      const resourceMap = getWrapper({ showMap: true }).find(ResourceMap);
      expect(resourceMap.prop('showMap')).to.equal(true);
    });

    it('renders SearchControls with correct props', () => {
      const searchControls = getWrapper().find(SearchControls);
      expect(searchControls.length).to.equal(1);
      expect(searchControls.prop('location')).to.deep.equal(defaultProps.location);
      expect(searchControls.prop('params')).to.deep.equal(defaultProps.params);
      expect(searchControls.prop('scrollToSearchResults')).to.be.a('function');
    });

    describe('SearchResults', () => {
      function getSearchResults(props) {
        return getWrapper(props).find(SearchResults);
      }

      it('are not rendered when no search has been done', () => {
        const isFetchingSearchResults = false;
        const searchDone = false;
        const searchResults = getSearchResults({ isFetchingSearchResults, searchDone });
        expect(searchResults.length).to.equal(0);
      });

      it('are rendered when fetching search results', () => {
        const isFetchingSearchResults = true;
        const searchDone = false;
        const searchResults = getSearchResults({ isFetchingSearchResults, searchDone });
        expect(searchResults.props().isFetching).to.equal(isFetchingSearchResults);
        expect(searchResults.props().searchResultIds).to.deep.equal(defaultProps.searchResultIds);
      });

      it('are rendered when search is done', () => {
        const isFetchingSearchResults = false;
        const searchDone = true;
        const searchResults = getSearchResults({ isFetchingSearchResults, searchDone });
        expect(searchResults.props().isFetching).to.equal(isFetchingSearchResults);
        expect(searchResults.props().onToggleMap).to.equal(defaultProps.actions.toggleMap);
        expect(searchResults.props().searchResultIds).to.deep.equal(defaultProps.searchResultIds);
        expect(searchResults.props().showMap).to.equal(defaultProps.showMap);
      });
    });
  });

  describe('componentDidMount', () => {
    function callComponentDidMount(props, extraActions) {
      const actions = { ...defaultProps.actions, ...extraActions };
      const instance = getWrapper({ ...props, actions }).instance();
      instance.componentDidMount();
    }

    it('fetches resources if searchDone is false', () => {
      const searchResources = simple.mock();
      callComponentDidMount({ searchDone: false }, { searchResources });
      expect(searchResources.callCount).to.equal(1);
      expect(searchResources.lastCall.args).to.deep.equal([defaultProps.filters]);
    });

    it('fetches resources if ui filters do not match url filters', () => {
      const searchResources = simple.mock();
      const props = {
        filters: { people: 1 },
        uiFilters: { people: 2 },
        searchDone: true,
      };
      callComponentDidMount(props, { searchResources });
      expect(searchResources.callCount).to.equal(1);
      expect(searchResources.lastCall.args).to.deep.equal([props.filters]);
    });

    it('does not fetch resources otherwise', () => {
      const searchResources = simple.mock();
      callComponentDidMount({ searchDone: true }, { searchResources });
      expect(searchResources.callCount).to.equal(0);
    });

    it('fetches units', () => {
      const fetchUnits = simple.mock();
      callComponentDidMount({}, { fetchUnits });
      expect(fetchUnits.callCount).to.equal(1);
    });
  });

  describe('componentWillUpdate', () => {
    describe('if isLoggedIn changed', () => {
      let nextProps;

      before(() => {
        defaultProps.actions.changeSearchFilters.reset();
        defaultProps.actions.searchResources.reset();
        const instance = getWrapper().instance();
        nextProps = {
          filters: defaultProps.filters,
          isLoggedIn: !defaultProps.isLoggedIn,
          url: '/?search=some-search',
        };
        instance.componentWillUpdate(nextProps);
      });

      it('refetches search results', () => {
        expect(defaultProps.actions.searchResources.callCount).to.equal(1);
      });

      it('does not update search filters in state', () => {
        expect(defaultProps.actions.changeSearchFilters.callCount).to.equal(0);
      });
    });

    describe('if search filters did change and url has query part', () => {
      let nextProps;

      before(() => {
        defaultProps.actions.changeSearchFilters.reset();
        defaultProps.actions.searchResources.reset();
        const instance = getWrapper().instance();
        nextProps = {
          filters: { purpose: 'new-purpose' },
          isLoggedIn: defaultProps.isLoggedIn,
          url: '/?purpose=new-purpose',
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
          isLoggedIn: defaultProps.isLoggedIn,
          url: '/?search=some-search',
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
