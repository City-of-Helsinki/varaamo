import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { clearSearchResults, selectUnit, toggleMap } from 'actions/searchActions';
import types from 'constants/ActionTypes';
import Resource from 'utils/fixtures/Resource';
import searchReducer from './searchReducer';

describe('state/reducers/ui/searchReducer', () => {
  describe('initial state', () => {
    const initialState = searchReducer(undefined, {});

    describe('filters', () => {
      it('is an object', () => {
        expect(typeof initialState.filters).to.equal('object');
      });

      it('date is an empty string', () => {
        expect(initialState.filters.date).to.equal('');
      });

      it('distance is an empty string', () => {
        expect(initialState.filters.distance).to.equal('');
      });

      it('people is an empty string', () => {
        expect(initialState.filters.people).to.equal('');
      });

      it('purpose is an empty string', () => {
        expect(initialState.filters.purpose).to.equal('');
      });

      it('search is an empty string', () => {
        expect(initialState.filters.search).to.equal('');
      });
    });

    it('position is null', () => {
      expect(initialState.position).to.equal(null);
    });

    it('results is an empty array', () => {
      expect(initialState.results).to.deep.equal([]);
    });

    it('searchDone is false', () => {
      expect(initialState.searchDone).to.equal(false);
    });

    it('unitId is null', () => {
      expect(initialState.unitId).to.equal(null);
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
      const resources = [
        Resource.build(),
        Resource.build(),
      ];

      it('sets the given resource ids to results', () => {
        const action = searchResourcesSuccess(resources);
        const initialState = Immutable({
          results: [],
        });
        const expected = [resources[0].id, resources[1].id];
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).to.deep.equal(expected);
      });

      it('replaces the old ids in searchResults.ids', () => {
        const action = searchResourcesSuccess(resources);
        const initialState = Immutable({
          results: ['replace-this'],
        });
        const expected = [resources[0].id, resources[1].id];
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).to.deep.equal(expected);
      });

      it('sets searchDone to true', () => {
        const action = searchResourcesSuccess(resources);
        const initialState = Immutable({
          searchDone: false,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.searchDone).to.equal(true);
      });
    });

    describe('UI.CHANGE_SEARCH_FILTERS', () => {
      const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

      it('sets the given filters to filters', () => {
        const filters = { purpose: 'some-purpose' };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({
          filters: {},
        });
        const expected = Immutable(filters);
        const nextState = searchReducer(initialState, action);

        expect(nextState.filters).to.deep.equal(expected);
      });

      it('overrides previous values of same filters', () => {
        const filters = { purpose: 'some-purpose' };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({
          filters: { purpose: 'old-value' },
        });
        const expected = Immutable(filters);
        const nextState = searchReducer(initialState, action);

        expect(nextState.filters).to.deep.equal(expected);
      });

      it('does not override unspecified filters', () => {
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

        expect(nextState.filters).to.deep.equal(expected);
      });

      it('saves only supported filters', () => {
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

        expect(nextState.filters).to.deep.equal(expected);
      });
    });

    describe('UI.CLEAR_SEARCH_FILTERS', () => {
      it('clears filters', () => {
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
          people: '',
          purpose: '',
          search: '',
          start: '',
        };
        const action = clearSearchResults();
        const initialState = Immutable({ filters });
        const nextState = searchReducer(initialState, action);

        expect(nextState.filters).to.deep.equal(expected);
      });

      it('does not empty the search results', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          results: ['r-1', 'r-2'],
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).to.deep.equal(initialState.results);
      });

      it('does not change searchDone', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          searchDone: true,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.searchDone).to.equal(true);
      });
    });

    describe('UI.ENABLE_GEOPOSITION_SUCCESS', () => {
      const enableGeopositionSuccess = createAction(types.UI.ENABLE_GEOPOSITION_SUCCESS);

      it('sets the given position coords to filters', () => {
        const position = { coords: {
          accuracy: 10,
          latitude: 11,
          longitude: 12,
        } };
        const action = enableGeopositionSuccess(position);
        const initialState = Immutable({
          position: null,
        });

        const expected = Immutable({
          lat: 11,
          lon: 12,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.position).to.deep.equal(expected);
      });
    });

    describe('UI.ENABLE_GEOPOSITION_ERROR', () => {
      const enableGeopositionError = createAction(types.UI.ENABLE_GEOPOSITION_ERROR);

      it('sets position to null', () => {
        const position = {
          lat: 11,
          lon: 12,
        };
        const action = enableGeopositionError();
        const initialState = Immutable({ position });
        const nextState = searchReducer(initialState, action);

        expect(nextState.position).to.deep.equal(null);
      });
    });

    describe('UI.DISABLE_GEOPOSITION', () => {
      const disableGeoposition = createAction(types.UI.DISABLE_GEOPOSITION);

      it('sets position to null', () => {
        const position = {
          lat: 11,
          lon: 12,
        };
        const action = disableGeoposition();
        const initialState = Immutable({ position });
        const nextState = searchReducer(initialState, action);

        expect(nextState.position).to.deep.equal(null);
      });
    });

    describe('UI.TOGGLE_SEARCH_SHOW_MAP', () => {
      it('toggles showMap if false', () => {
        const action = toggleMap();
        const initialState = Immutable({
          showMap: false,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.showMap).to.be.true;
      });

      it('toggles showMap if true', () => {
        const action = toggleMap();
        const initialState = Immutable({
          showMap: true,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.showMap).to.be.false;
      });
    });

    describe('UI.SELECT_SEARCH_RESULTS_UNIT', () => {
      it('Sets action payload content to unitId', () => {
        const action = selectUnit('123');
        const initialState = Immutable({
          unitId: null,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.unitId).to.equal('123');
      });
    });
  });
});
