import React from 'react';
import Immutable from 'seamless-immutable';
import Row from 'react-bootstrap/lib/Row';
import simple from 'simple-mock';

import PageWrapper from '../PageWrapper';
import { shallowWithIntl } from '../../utils/testUtils';
import ResourceMap from '../../shared/resource-map';
import { UnconnectedSearchPage as SearchPage } from './SearchPage';
import Sort from './Sort';
import SearchControls from './controls';
import SearchResults from './results/SearchResults';
import MapToggle from './results/MapToggle';

describe('pages/search/SearchPage', () => {
  const defaultProps = {
    actions: {
      changeSearchFilters: simple.stub(),
      fetchPurposes: simple.stub(),
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
    location: {
      search: 'data:2015-10-10',
    },
    history: {},
    match: { params: {} },
    position: null,
    resultCount: 2,
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
    test('renders SearchControls with correct props', () => {
      const searchControls = getWrapper().find(SearchControls);
      expect(searchControls.length).toBe(1);
      expect(searchControls.prop('location')).toEqual(defaultProps.location);
      expect(searchControls.prop('params')).toEqual(defaultProps.match.params);
    });

    test('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('className')).toBe('app-SearchPage__wrapper');
      expect(pageWrapper.prop('title')).toBe('SearchPage.title');
      expect(pageWrapper.prop('transparent')).toBe(true);
    });

    test('renders a MapToggle component with correct props', () => {
      const mapToggle = getWrapper().find(MapToggle);
      expect(mapToggle).toHaveLength(1);
      expect(mapToggle.props()).toEqual({
        mapVisible: defaultProps.showMap,
        onClick: defaultProps.actions.toggleMap,
        resultCount: defaultProps.resultCount,
      });
    });

    test('renders a ResourceMap with correct props', () => {
      const props = {
        searchResultIds: Immutable(['resource-1', 'resource-2']),
        selectedUnitId: '123',
        showMap: true,
      };
      const resourceMap = getWrapper(props).find(ResourceMap);
      expect(resourceMap).toHaveLength(1);
      expect(resourceMap.prop('showMap')).toBe(true);
      expect(resourceMap.prop('resourceIds')).toEqual(props.searchResultIds);
      expect(resourceMap.prop('selectedUnitId')).toBe(props.selectedUnitId);
    });

    test('renders an Row element', () => {
      expect(getWrapper().find(Row)).toHaveLength(1);
    });

    test('renders a Sort component with correct props', () => {
      const sort = getWrapper().find(Sort);
      expect(sort).toHaveLength(1);
      expect(typeof sort.prop('onChange')).toBe('function');
    });

    describe('SearchResults', () => {
      function getSearchResults(props) {
        return getWrapper(props).find(SearchResults);
      }

      test('are not rendered when no search has been done', () => {
        const isFetchingSearchResults = false;
        const searchDone = false;
        const searchResults = getSearchResults({ isFetchingSearchResults, searchDone });
        expect(searchResults.length).toBe(0);
      });

      test('are rendered when fetching search results', () => {
        const isFetchingSearchResults = true;
        const searchDone = false;
        const searchResults = getSearchResults({ isFetchingSearchResults, searchDone });
        expect(searchResults.props().isFetching).toBe(isFetchingSearchResults);
        expect(searchResults.props().searchResultIds).toEqual(defaultProps.searchResultIds);
      });

      test('are rendered when search is done', () => {
        const isFetchingSearchResults = false;
        const searchDone = true;
        const searchResults = getSearchResults({ isFetchingSearchResults, searchDone });
        expect(searchResults.props().isFetching).toBe(isFetchingSearchResults);
        expect(searchResults.props().resultCount).toBe(defaultProps.resultCount);
        expect(searchResults.props().searchResultIds).toEqual(defaultProps.searchResultIds);
        expect(searchResults.props().showMap).toBe(defaultProps.showMap);
      });
    });
  });

  describe('componentDidMount', () => {
    function callComponentDidMount(props, extraActions) {
      const actions = { ...defaultProps.actions, ...extraActions };
      const instance = getWrapper({ ...props, actions }).instance();
      instance.componentDidMount();
    }

    test('fetches resources if searchDone is false', () => {
      const searchResources = simple.mock();
      callComponentDidMount({ searchDone: false }, { searchResources });
      expect(searchResources.callCount).toBe(1);
      expect(searchResources.lastCall.args).toEqual([defaultProps.filters]);
    });

    test('fetches resources if ui filters do not match url filters', () => {
      const searchResources = simple.mock();
      const props = {
        filters: { people: 1 },
        uiFilters: { people: 2 },
        searchDone: true,
      };
      callComponentDidMount(props, { searchResources });
      expect(searchResources.callCount).toBe(1);
      expect(searchResources.lastCall.args).toEqual([props.filters]);
    });

    test('does not fetch resources otherwise', () => {
      const searchResources = simple.mock();
      callComponentDidMount({ searchDone: true }, { searchResources });
      expect(searchResources.callCount).toBe(0);
    });

    test('fetches units', () => {
      const fetchUnits = simple.mock();
      callComponentDidMount({}, { fetchUnits });
      expect(fetchUnits.callCount).toBe(1);
    });

    describe('scrolls to correct position', () => {
      const setTimeoutMock = simple.mock();
      const scrollToMock = simple.mock();
      const scrollTop = 123;

      beforeAll(() => {
        const location = { state: { scrollTop } };
        const props = Object.assign({}, defaultProps, { location });
        simple.mock(window, 'setTimeout', setTimeoutMock);
        simple.mock(window, 'scrollTo', scrollToMock);
        callComponentDidMount(props, {});
      });

      afterAll(() => {
        simple.restore();
      });

      test('calls setTimeout and scrolls to correct position', () => {
        expect(setTimeoutMock.callCount).toBe(1);
        const args = setTimeoutMock.lastCall.args;
        expect(args).toHaveLength(2);
        expect(typeof args[0]).toBe('function');
        args[0]();
        expect(scrollToMock.callCount).toBe(1);
        const args2 = scrollToMock.lastCall.args;
        expect(args2).toHaveLength(2);
        expect(args2[0]).toBe(0);
        expect(args2[1]).toBe(scrollTop);
      });
    });
  });

  describe('componentWillUpdate', () => {
    describe('if isLoggedIn changed', () => {
      let nextProps;

      beforeAll(() => {
        defaultProps.actions.changeSearchFilters.reset();
        defaultProps.actions.searchResources.reset();
        const instance = getWrapper().instance();
        nextProps = {
          filters: defaultProps.filters,
          isLoggedIn: !defaultProps.isLoggedIn,
          location: defaultProps.location,
          position: null,
          url: '/?search=some-search',
        };
        instance.componentWillUpdate(nextProps);
      });

      test('refetches search results', () => {
        expect(defaultProps.actions.searchResources.callCount).toBe(1);
      });

      test('does not update search filters in state', () => {
        expect(defaultProps.actions.changeSearchFilters.callCount).toBe(0);
      });
    });

    describe('sortResource', () => {
      const pushMock = simple.mock();
      beforeAll(() => {
        const instance = getWrapper(
          {
            history: { push: pushMock }
          }
        ).instance();
        instance.sortResource('name');
      });

      test('changes history with correct queryString', () => {
        expect(pushMock.callCount).toBe(1);
        expect(pushMock.lastCall.args[0]).toContain('name');
      });
    });

    describe('if search filters did change and url has query part', () => {
      let nextProps;

      beforeAll(() => {
        defaultProps.actions.changeSearchFilters.reset();
        defaultProps.actions.searchResources.reset();
        const instance = getWrapper().instance();
        nextProps = {
          filters: { purpose: 'new-purpose' },
          isLoggedIn: defaultProps.isLoggedIn,
          location: defaultProps.location,
          position: null,
          url: '/?purpose=new-purpose',
        };
        instance.componentWillUpdate(nextProps);
      });

      test('updates search filters in state with the new filters', () => {
        const actualArg = defaultProps.actions.changeSearchFilters.lastCall.args[0];

        expect(defaultProps.actions.changeSearchFilters.callCount).toBe(1);
        expect(actualArg).toEqual(nextProps.filters);
      });

      test('searches resources with given filters', () => {
        const actualArg = defaultProps.actions.searchResources.lastCall.args[0];

        expect(defaultProps.actions.searchResources.callCount).toBe(1);
        expect(actualArg).toEqual(nextProps.filters);
      });
    });

    describe('if search filters did not change', () => {
      let nextProps;

      beforeAll(() => {
        defaultProps.actions.changeSearchFilters.reset();
        defaultProps.actions.searchResources.reset();
        const instance = getWrapper().instance();
        nextProps = {
          filters: defaultProps.filters,
          isLoggedIn: defaultProps.isLoggedIn,
          location: defaultProps.location,
          position: null,
          url: '/?search=some-search',
        };
        instance.componentWillUpdate(nextProps);
      });

      test('does not update search filters in state', () => {
        expect(defaultProps.actions.changeSearchFilters.callCount).toBe(0);
      });

      test('does not do a search', () => {
        expect(defaultProps.actions.searchResources.callCount).toBe(0);
      });
    });

    describe('if position changed', () => {
      let nextProps;

      beforeAll(() => {
        defaultProps.actions.changeSearchFilters.reset();
        defaultProps.actions.searchResources.reset();
        const instance = getWrapper().instance();
        nextProps = {
          filters: defaultProps.filters,
          isLoggedIn: defaultProps.isLoggedIn,
          location: defaultProps.location,
          position: {
            lat: 12,
            lon: 11,
          },
        };
        instance.componentWillUpdate(nextProps);
      });

      test('refetches search results', () => {
        expect(defaultProps.actions.searchResources.callCount).toBe(1);
      });

      test('includes position argument on searchResources call', () => {
        expect(defaultProps.actions.searchResources.lastCall.args[0].lat).toBe(12);
        expect(defaultProps.actions.searchResources.lastCall.args[0].lon).toBe(11);
      });
    });

    describe('if location state changed', () => {
      beforeAll(() => {
        simple.mock(window, 'scrollTo');
        const instance = getWrapper().instance();
        const nextProps = {
          filters: defaultProps.filters,
          isLoggedIn: defaultProps.isLoggedIn,
          location: {
            state: null,
          },
          position: defaultProps.position,
        };
        instance.componentWillUpdate(nextProps);
      });

      afterAll(() => {
        simple.restore();
      });

      test('scrolls to top of page', () => {
        expect(window.scrollTo.callCount).toBe(1);
        expect(window.scrollTo.lastCall.args).toEqual([0, 0]);
      });
    });
  });
});
