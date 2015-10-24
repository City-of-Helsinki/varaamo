import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import Unit from 'fixtures/Unit';
import searchPageSelector from 'selectors/containers/searchPageSelector';

describe('Selector: searchPageSelector', () => {
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
    const selected = searchPageSelector(state);

    expect(selected.filters).to.exist;
  });

  it('should return isFetchingSearchResults', () => {
    const selected = searchPageSelector(state);

    expect(selected.isFetchingSearchResults).to.exist;
  });

  it('should return results', () => {
    const selected = searchPageSelector(state);

    expect(selected.results).to.exist;
  });

  it('should return units from the state', () => {
    const selected = searchPageSelector(state);
    const expected = state.data.units;

    expect(selected.units).to.deep.equal(expected);
  });
});
