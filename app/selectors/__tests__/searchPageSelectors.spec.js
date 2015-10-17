import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import { searchPageSelectors } from 'selectors/searchPageSelectors';

describe('Selectors: searchPageSelectors', () => {
  const resources = [
    Resource.build(),
    Resource.build(),
  ];
  const unit = Unit.build();
  const state = {
    api: Immutable({
      isFetchingSearchResults: false,
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
        filters: { purpose: 'some-purpose' },
        results: [resources[0].id, resources[1].id],
      },
    }),
  };

  it('should return isFetchingSearchResults from the state', () => {
    const selected = searchPageSelectors(state);
    const expected = state.api.isFetchingSearchResults;

    expect(selected.isFetchingSearchResults).to.equal(expected);
  });

  it('should return filters from the state', () => {
    const selected = searchPageSelectors(state);
    const expected = state.ui.search.filters;

    expect(selected.filters).to.deep.equal(expected);
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
