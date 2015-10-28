import { expect } from 'chai';
import MockDate from 'mockdate';

import dateSelector from 'selectors/dateSelector';

function getState(date) {
  return {
    router: {
      location: {
        query: {
          date,
        },
      },
    },
  };
}

describe('Selector: dateSelector', () => {
  it('should return the date if it is defined', () => {
    const date = '2015-10-10';
    const state = getState(date);
    const actual = dateSelector(state);

    expect(actual).to.equal(date);
  });

  it('should return current date string if date is not defined', () => {
    const state = getState('');
    MockDate.set('2015-12-24T12:00:00Z');
    const actual = dateSelector(state);
    MockDate.reset();
    const expected = '2015-12-24';

    expect(actual).to.equal(expected);
  });
});
