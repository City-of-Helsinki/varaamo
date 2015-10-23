import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import Unit from 'fixtures/Unit';
import { searchPageSelectors } from 'selectors/searchPageSelectors';

describe('Selectors: searchPageSelectors', () => {
  let unit;
  let state;

  beforeEach(() => {
    unit = Unit.build();

    state = {
      api: Immutable({
        activeRequests: [],
      }),
      data: Immutable({
        resources: {},
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
          results: [],
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

  it('should return results', () => {
    const selected = searchPageSelectors(state);

    expect(selected.results).to.exist;
  });

  it('should return units from the state', () => {
    const selected = searchPageSelectors(state);
    const expected = state.data.units;

    expect(selected.units).to.deep.equal(expected);
  });
});
