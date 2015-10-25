import { expect } from 'chai';
import MockDate from 'mockdate';

import Immutable from 'seamless-immutable';

import searchFiltersSelector from 'selectors/searchFiltersSelector';

function getState(date = '2015-10-10') {
  return {
    ui: Immutable({
      search: {
        filters: {
          date: date,
          purpose: 'some-purpose',
        },
      },
    }),
  };
}

describe('Selector: searchFiltersSelector', () => {
  it('should return search filters from the state', () => {
    const state = getState();
    const actual = searchFiltersSelector(state);
    const expected = state.ui.search.filters;

    expect(actual).to.deep.equal(expected);
  });

  it('should return current date as the date filter if date is an empty string in state', () => {
    const state = getState('');
    MockDate.set('2015-12-24T16:07:37Z');
    const actual = searchFiltersSelector(state);
    MockDate.reset();
    const filters = state.ui.search.filters;
    const expected = Object.assign({}, filters, { date: '2015-12-24' });

    expect(actual).to.deep.equal(expected);
  });
});
