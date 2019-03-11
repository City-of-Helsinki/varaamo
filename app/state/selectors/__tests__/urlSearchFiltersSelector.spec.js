import MockDate from 'mockdate';

import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';

describe('Selector: urlSearchFiltersSelector', () => {
  const filters = {
    freeOfCharge: '',
    date: '2015-10-10',
    distance: '',
    duration: '30',
    end: '23:30',
    page: 1,
    people: '',
    purpose: 'some-purpose',
    search: '',
    start: '08:30',
    unit: '',
    useTimeRange: false,
    municipality: '',
  };

  const getProps = (
    date = filters.date,
    start = filters.start,
    freeOfCharge = filters.freeOfCharge
  ) => ({
    location: {
      search: `?freeOfCharge=${freeOfCharge}&date=${date}&distance=&duration=30&end=23:30&page=1&people=&purpose=some-purpose&search=&start=${start}&unit=&useTimeRange=false`,
    },
  });

  test('returns search filters from the props', () => {
    const state = {};
    const props = getProps();
    const actual = urlSearchFiltersSelector(state, props);
    const expected = filters;

    expect(actual).toEqual(expected);
  });

  test(
    'returns current date as the date filter if date is an empty string in props',
    () => {
      const state = {};
      const props = getProps('');
      MockDate.set('2015-12-24T16:07:37Z');
      const actual = urlSearchFiltersSelector(state, props);
      MockDate.reset();
      const expected = Object.assign({}, filters, { date: '2015-12-24' });

      expect(actual).toEqual(expected);
    }
  );

  describe('freeOfCharge', () => {
    test(
      'assigns true value when the correspondent param is given a true value',
      () => {
        const state = {};
        const props = getProps(undefined, undefined, true);
        const actual = urlSearchFiltersSelector(state, props);

        expect(actual.freeOfCharge).toBe(true);
      }
    );

    test(
      'assigns an empty string when the correspondent param is not true',
      () => {
        const state = {};
        const props = getProps(undefined, undefined, false);
        const actual = urlSearchFiltersSelector(state, props);

        expect(actual.freeOfCharge).toBe('');
      }
    );
  });
});
