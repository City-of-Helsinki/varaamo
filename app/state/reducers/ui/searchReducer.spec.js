import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { clearSearchResults } from 'actions/searchActions';
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

      it('people is an empty string', () => {
        expect(initialState.filters.purpose).to.equal('');
      });

      it('purpose is an empty string', () => {
        expect(initialState.filters.purpose).to.equal('');
      });

      it('search is an empty string', () => {
        expect(initialState.filters.search).to.equal('');
      });
    });

    it('results is an empty array', () => {
      expect(initialState.results).to.deep.equal([]);
    });

    it('searchDone is false', () => {
      expect(initialState.searchDone).to.equal(false);
    });

    it('typeaheadSuggestions is an empty array', () => {
      expect(initialState.typeaheadSuggestions).to.deep.equal([]);
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

    describe('API.TYPEAHEAD_SUGGESTIONS_GET_SUCCESS', () => {
      const typeaheadSuggestionsSuccess = createAction(
        types.API.TYPEAHEAD_SUGGESTIONS_GET_SUCCESS,
        resources => ({
          resource: keyBy(resources, 'id'),
        })
      );
      const resources = [
        Resource.build(),
        Resource.build(),
      ];

      it('sets the given resources to typeaheadSuggestions', () => {
        const action = typeaheadSuggestionsSuccess(resources);
        const initialState = Immutable({
          typeaheadSuggestions: [],
        });
        const expected = resources;
        const nextState = searchReducer(initialState, action);

        expect(nextState.typeaheadSuggestions).to.deep.equal(expected);
      });

      it('replaces the old ids in searchResults.ids', () => {
        const action = typeaheadSuggestionsSuccess(resources);
        const initialState = Immutable({
          typeaheadSuggestions: ['replace-this'],
        });
        const expected = resources;
        const nextState = searchReducer(initialState, action);

        expect(nextState.typeaheadSuggestions).to.deep.equal(expected);
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

    describe('UI.CLEAR_SEARCH_RESULTS', () => {
      it('empties the search results', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          results: ['r-1', 'r-2'],
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).to.deep.equal([]);
      });

      it('sets searchDone to false', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          searchDone: true,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.searchDone).to.equal(false);
      });

      it('empties typeaheadSuggestions', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          typeaheadSuggestions: ['r-1', 'r-2'],
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).to.deep.equal([]);
      });
    });
  });
});
