import MockDate from 'mockdate';

import dateSelector from '../dateSelector';

function getProps(date) {
  return {
    location: {
      search: `?date=${date}`,
    },
  };
}

describe('Selector: dateSelector', () => {
  describe('if props.location exists', () => {
    test('returns the date if it is defined', () => {
      const date = '2015-10-10';
      const state = {};
      const props = getProps(date);
      const actual = dateSelector(state, props);

      expect(actual).toBe(date);
    });

    test('returns current date string if date is not defined', () => {
      const state = {};
      const props = getProps('');
      MockDate.set('2015-12-24T12:00:00Z');
      const actual = dateSelector(state, props);
      MockDate.reset();
      const expected = '2015-12-24';

      expect(actual).toBe(expected);
    });
  });
});
