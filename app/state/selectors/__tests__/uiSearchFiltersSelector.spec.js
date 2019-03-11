import MockDate from 'mockdate';

import uiSearchFiltersSelector from 'state/selectors/uiSearchFiltersSelector';

function getState(date = '2015-10-10', start = '08:30', freeOfCharge = '') {
  return {
    ui: {
      search: {
        filters: {
          freeOfCharge,
          date,
          distance: '',
          duration: 30,
          end: '23:30',
          municipality: '',
          page: 1,
          people: '',
          purpose: 'some-purpose',
          search: '',
          start,
          unit: '',
          useTimeRange: false,
        },
      },
    },
  };
}

describe('Selector: uiSearchFiltersSelector', () => {
  test('returns search filters from the state', () => {
    const state = getState();
    const actual = uiSearchFiltersSelector(state);
    const expected = state.ui.search.filters;

    expect(actual).toEqual(expected);
  });

  test(
    'returns current date as the date filter if date is an empty string in state',
    () => {
      const state = getState('');
      MockDate.set('2015-12-24T16:07:37Z');
      const actual = uiSearchFiltersSelector(state);
      MockDate.reset();
      const filters = state.ui.search.filters;
      const expected = Object.assign({}, filters, { date: '2015-12-24' });

      expect(actual).toEqual(expected);
    }
  );

  describe('freeOfCharge', () => {
    test(
      'assigns true value when the correspondent argument is given a true value',
      () => {
        const state = getState(undefined, undefined, true);
        const actual = uiSearchFiltersSelector(state);

        expect(actual.freeOfCharge).toBe(true);
      }
    );

    test(
      'assigns an empty string when the correspondent argument is not true',
      () => {
        const state = getState(undefined, undefined, false);
        const actual = uiSearchFiltersSelector(state);

        expect(actual.freeOfCharge).toBe('');
      }
    );
  });
});
