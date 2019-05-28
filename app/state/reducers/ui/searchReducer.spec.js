import keyBy from 'lodash/keyBy';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from '../../../constants/ActionTypes';
import { clearSearchResults, selectUnit, toggleMap } from '../../../actions/searchActions';
import Resource from '../../../utils/fixtures/Resource';
import searchReducer from './searchReducer';

describe('state/reducers/ui/searchReducer', () => {
  describe('initial state', () => {
    const initialState = searchReducer(undefined, {});

    describe('filters', () => {
      test('is an object', () => {
        expect(typeof initialState.filters).toBe('object');
      });

      test('date is an empty string', () => {
        expect(initialState.filters.date).toBe('');
      });

      test('distance is an empty string', () => {
        expect(initialState.filters.distance).toBe('');
      });

      test('people is an empty string', () => {
        expect(initialState.filters.people).toBe('');
      });

      test('purpose is an empty string', () => {
        expect(initialState.filters.purpose).toBe('');
      });

      test('search is an empty string', () => {
        expect(initialState.filters.search).toBe('');
      });
    });

    test('position is null', () => {
      expect(initialState.position).toBeNull();
    });

    test('results is an empty array', () => {
      expect(initialState.results).toEqual([]);
    });

    test('searchDone is false', () => {
      expect(initialState.searchDone).toBe(false);
    });

    test('unitId is null', () => {
      expect(initialState.unitId).toBeNull();
    });
  });

  describe('handling actions', () => {
    describe('API.SEARCH_RESULTS_GET_SUCCESS', () => {
      const searchResourcesSuccess = createAction(
        types.API.SEARCH_RESULTS_GET_SUCCESS,
        resources => ({
          entities: {
            resources: keyBy(resources, 'id'),
          },
        })
      );
      const resources = [Resource.build(), Resource.build()];

      test('sets the given resource ids to results', () => {
        const action = searchResourcesSuccess(resources);
        const initialState = Immutable({
          results: [],
        });
        const expected = [resources[0].id, resources[1].id];
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).toEqual(expected);
      });

      test('replaces the old ids in searchResults.ids', () => {
        const action = searchResourcesSuccess(resources);
        const initialState = Immutable({
          results: ['replace-this'],
        });
        const expected = [resources[0].id, resources[1].id];
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).toEqual(expected);
      });

      test('sets searchDone to true', () => {
        const action = searchResourcesSuccess(resources);
        const initialState = Immutable({
          searchDone: false,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.searchDone).toBe(true);
      });
    });

    describe('UI.CHANGE_SEARCH_FILTERS', () => {
      const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

      test('sets the given filters to filters', () => {
        const filters = { purpose: 'some-purpose' };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({
          filters: {},
        });
        const expected = Immutable(filters);
        const nextState = searchReducer(initialState, action);

        expect(nextState.filters).toEqual(expected);
      });

      test('overrides previous values of same filters', () => {
        const filters = { purpose: 'some-purpose' };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({
          filters: { purpose: 'old-value' },
        });
        const expected = Immutable(filters);
        const nextState = searchReducer(initialState, action);

        expect(nextState.filters).toEqual(expected);
      });

      test('does not override unspecified filters', () => {
        const filters = { purpose: 'some-purpose' };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({
          filters: { search: 'search-query' },
        });
        const expected = Immutable({
          purpose: 'some-purpose',
          search: 'search-query',
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.filters).toEqual(expected);
      });

      test('saves only supported filters', () => {
        const filters = {
          purpose: 'some-purpose',
          search: 'search-query',
          unsupported: 'invalid',
        };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({ filters: {} });
        const expected = Immutable({
          purpose: 'some-purpose',
          search: 'search-query',
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.filters).toEqual(expected);
      });
    });

    describe('UI.CLEAR_SEARCH_FILTERS', () => {
      test('clears filters', () => {
        const filters = {
          date: '2017-12-12',
          distance: '5000',
          people: '12',
          purpose: 'some-purpose',
          search: 'search-query',
        };
        const expected = {
          date: '',
          distance: '',
          duration: 0,
          end: '',
          municipality: [],
          people: '',
          purpose: '',
          search: '',
          start: '',
          useTimeRange: false,
          orderBy: ''
        };
        const action = clearSearchResults();
        const initialState = Immutable({ filters });
        const nextState = searchReducer(initialState, action);

        expect(nextState.filters).toEqual(expected);
      });

      test('does not empty the search results', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          results: ['r-1', 'r-2'],
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).toEqual(initialState.results);
      });

      test('does not change searchDone', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          searchDone: true,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.searchDone).toBe(true);
      });
    });

    describe('UI.ENABLE_GEOPOSITION_SUCCESS', () => {
      const enableGeopositionSuccess = createAction(types.UI.ENABLE_GEOPOSITION_SUCCESS);

      test('sets the given position coords to filters', () => {
        const position = {
          coords: {
            accuracy: 10,
            latitude: 11,
            longitude: 12,
          },
        };
        const action = enableGeopositionSuccess(position);
        const initialState = Immutable({
          position: null,
        });

        const expected = Immutable({
          lat: 11,
          lon: 12,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.position).toEqual(expected);
      });
    });

    describe('UI.ENABLE_GEOPOSITION_ERROR', () => {
      const enableGeopositionError = createAction(types.UI.ENABLE_GEOPOSITION_ERROR);

      test('sets position to null', () => {
        const position = {
          lat: 11,
          lon: 12,
        };
        const action = enableGeopositionError();
        const initialState = Immutable({ position });
        const nextState = searchReducer(initialState, action);

        expect(nextState.position).toEqual(null);
      });
    });

    describe('UI.DISABLE_GEOPOSITION', () => {
      const disableGeoposition = createAction(types.UI.DISABLE_GEOPOSITION);

      test('sets position to null', () => {
        const position = {
          lat: 11,
          lon: 12,
        };
        const action = disableGeoposition();
        const initialState = Immutable({ position });
        const nextState = searchReducer(initialState, action);

        expect(nextState.position).toEqual(null);
      });
    });

    describe('UI.TOGGLE_SEARCH_SHOW_MAP', () => {
      test('toggles showMap if false', () => {
        const action = toggleMap();
        const initialState = Immutable({
          showMap: false,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.showMap).toBe(true);
      });

      test('toggles showMap if true', () => {
        const action = toggleMap();
        const initialState = Immutable({
          showMap: true,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.showMap).toBe(false);
      });
    });

    describe('UI.SELECT_SEARCH_RESULTS_UNIT', () => {
      test('Sets action payload content to unitId', () => {
        const action = selectUnit('123');
        const initialState = Immutable({
          unitId: null,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.unitId).toBe('123');
      });
    });
  });
});
