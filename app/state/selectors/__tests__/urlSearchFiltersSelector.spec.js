import { expect } from 'chai';
import MockDate from 'mockdate';

import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';

function getProps(date = '2015-10-10') {
  return {
    location: {
      query: {
        date,
        people: '',
        purpose: 'some-purpose',
        search: '',
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
