import { expect } from 'chai';
import MockDate from 'mockdate';

import searchFiltersSelector from 'selectors/searchFiltersSelector';

function getState(date = '2015-10-10') {
  return {
    router: {
      location: {
        query: {
          date: date,
          people: '',
          purpose: 'some-purpose',
          search: '',
        },
      },
    },
  };
}

describe('Selector: searchFiltersSelector', () => {
  it('should return search filters from the state', () => {
    const state = getState();
    const actual = searchFiltersSelector(state);
    const expected = state.router.location.query;

    expect(actual).to.deep.equal(expected);
  });

  it('should return current date as the date filter if date is an empty string in state', () => {
    const state = getState('');
    MockDate.set('2015-12-24T16:07:37Z');
    const actual = searchFiltersSelector(state);
    MockDate.reset();
    const filters = state.router.location.query;
    const expected = Object.assign({}, filters, { date: '2015-12-24' });

    expect(actual).to.deep.equal(expected);
  });
});
