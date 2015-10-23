import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import { searchPageSelectors } from 'selectors/searchPageSelectors';

describe('Selectors: searchPageSelectors', () => {
  let unit;
  let resources;
  let state;

  beforeEach(() => {
    resources = [
      Resource.build(),
      Resource.build(),
    ];

    unit = Unit.build();

    state = {
      api: Immutable({
        activeRequests: [],
      }),
      data: Immutable({
        resources: {
          [resources[0].id]: resources[0],
          [resources[1].id]: resources[1],
        },
        units: {
          [unit.id]: unit,
        },
      }),
      ui: Immutable({
        search: {
          filters: {
            date: '2015-10-10',
            purpose: 'some-purpose',
          },
          results: [resources[0].id, resources[1].id],
        },
      }),
    };
  });

  it('should return filters', () => {
    const selected = searchPageSelectors(state);

    expect(selected.filters).to.exist;
  });

  describe('isFetchingSearchResults', () => {
    it('should return true if RESOURCES_GET_REQUEST is in activeRequests', () => {
      state.api.activeRequests = [types.API.RESOURCES_GET_REQUEST];
      const selected = searchPageSelectors(state);

      expect(selected.isFetchingSearchResults).to.equal(true);
    });

    it('should return false if RESOURCES_GET_REQUEST is not in activeRequests', () => {
      const selected = searchPageSelectors(state);

      expect(selected.isFetchingSearchResults).to.equal(false);
    });
  });

  it('should return resources corresponding to searchResults.ids as results', () => {
    const selected = searchPageSelectors(state);
    const expected = [resources[0], resources[1]];

    expect(selected.results).to.deep.equal(expected);
  });

  it('should return the results in alphabetical order', () => {
    const unsortedResults = [resources[1].id, resources[0].id];
    const unSortedState = _.merge({}, state, { ui: { search: { results: unsortedResults } } });

    const selected = searchPageSelectors(unSortedState);
    const expected = [resources[0], resources[1]];

    expect(selected.results).to.deep.equal(expected);
  });

  it('should return units from the state', () => {
    const selected = searchPageSelectors(state);
    const expected = state.data.units;

    expect(selected.units).to.deep.equal(expected);
  });
});
