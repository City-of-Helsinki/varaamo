import { expect } from 'chai';
import MockDate from 'mockdate';

import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';

function getProps(date = '2015-10-10', start = '08:30') {
  return {
    location: {
      query: {
        charge: false,
        date,
        distance: '',
        duration: 30,
        end: '23:30',
        page: 1,
        people: '',
        purpose: 'some-purpose',
        search: '',
        start,
        unit: '',
      },
    },
  };
}

describe('Selector: urlSearchFiltersSelector', () => {
  it('returns search filters from the props', () => {
    const state = {};
    const props = getProps();
    const actual = urlSearchFiltersSelector(state, props);
    const expected = props.location.query;

    expect(actual).to.deep.equal(expected);
  });

  it('returns current date as the date filter if date is an empty string in props', () => {
    const state = {};
    const props = getProps('');
    MockDate.set('2015-12-24T16:07:37Z');
    const actual = urlSearchFiltersSelector(state, props);
    MockDate.reset();
    const filters = props.location.query;
    const expected = Object.assign({}, filters, { date: '2015-12-24' });

    expect(actual).to.deep.equal(expected);
  });
});
