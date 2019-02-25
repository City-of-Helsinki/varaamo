import { expect } from 'chai';
import MockDate from 'mockdate';

import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';

describe('Selector: urlSearchFiltersSelector', () => {
  const filters = {
    charge: false,
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

  const getProps = (date = filters.date, start = filters.start) => ({
    location: {
      search: `?charge=false&date=${date}&distance=&duration=30&end=23:30&page=1&people=&purpose=some-purpose&search=&start=${start}&unit=&useTimeRange=false`,
    },
  });

  it('returns search filters from the props', () => {
    const state = {};
    const props = getProps();
    const actual = urlSearchFiltersSelector(state, props);
    const expected = filters;

    expect(actual).to.deep.equal(expected);
  });

  it('returns current date as the date filter if date is an empty string in props', () => {
    const state = {};
    const props = getProps('');
    MockDate.set('2015-12-24T16:07:37Z');
    const actual = urlSearchFiltersSelector(state, props);
    MockDate.reset();
    const expected = Object.assign({}, filters, { date: '2015-12-24' });

    expect(actual).to.deep.equal(expected);
  });
});
