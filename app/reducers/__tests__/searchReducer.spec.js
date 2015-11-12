import { expect } from 'chai';

import _ from 'lodash';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { clearSearchResults } from 'actions/searchActions';
import types from 'constants/ActionTypes';
import Resource from 'fixtures/Resource';
import searchReducer from 'reducers/searchReducer';

describe('Reducer: searchReducer', () => {
  describe('initial state', () => {
    const initialState = searchReducer(undefined, {});

    it('results should be an empty array', () => {
      expect(initialState.results).to.deep.equal([]);
    });

    it('searchDone should be false', () => {
      expect(initialState.searchDone).to.equal(false);
    });

    it('typeaheadSuggestions should be an empty array', () => {
      expect(initialState.typeaheadSuggestions).to.deep.equal([]);
    });
  });

  describe('handling actions', () => {
    describe('API.SEARCH_RESULTS_GET_SUCCESS', () => {
      const searchResourcesSuccess = createAction(
        types.API.SEARCH_RESULTS_GET_SUCCESS,
        (resources) => {
          return {
            entities: {
              resources: _.indexBy(resources, 'id'),
            },
          };
        }
      );
      const resources = [
        Resource.build(),
        Resource.build(),
      ];

      it('should set the given resource ids to results', () => {
        const action = searchResourcesSuccess(resources);
        const initialState = Immutable({
          results: [],
        });
        const expected = [resources[0].id, resources[1].id];
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).to.deep.equal(expected);
      });

      it('should replace the old ids in searchResults.ids', () => {
        const action = searchResourcesSuccess(resources);
        const initialState = Immutable({
          results: ['replace-this'],
        });
        const expected = [resources[0].id, resources[1].id];
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).to.deep.equal(expected);
      });

      it('should set searchDone to true', () => {
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
        (resources) => {
          return {
            resource: _.indexBy(resources, 'id'),
          };
        }
      );
      const resources = [
        Resource.build(),
        Resource.build(),
      ];

      it('should set the given resources to typeaheadSuggestions', () => {
        const action = typeaheadSuggestionsSuccess(resources);
        const initialState = Immutable({
          typeaheadSuggestions: [],
        });
        const expected = resources;
        const nextState = searchReducer(initialState, action);

        expect(nextState.typeaheadSuggestions).to.deep.equal(expected);
      });

      it('should replace the old ids in searchResults.ids', () => {
        const action = typeaheadSuggestionsSuccess(resources);
        const initialState = Immutable({
          typeaheadSuggestions: ['replace-this'],
        });
        const expected = resources;
        const nextState = searchReducer(initialState, action);

        expect(nextState.typeaheadSuggestions).to.deep.equal(expected);
      });
    });

    describe('UI.CLEAR_SEARCH_RESULTS', () => {
      it('should empty the search results', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          results: ['r-1', 'r-2'],
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.results).to.deep.equal([]);
      });

      it('should set searchDone to false', () => {
        const action = clearSearchResults();
        const initialState = Immutable({
          searchDone: true,
        });
        const nextState = searchReducer(initialState, action);

        expect(nextState.searchDone).to.equal(false);
      });

      it('should empty typeaheadSuggestions', () => {
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
