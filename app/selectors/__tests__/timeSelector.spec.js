import { expect } from 'chai';

import timeSelector from 'selectors/timeSelector';

function getState(time) {
  return {
    router: {
      location: {
        query: {
          time,
        },
      },
    },
  };
}

describe('Selector: timeSelector', () => {
  it('should return the time ISOString in utc time if time is defined', () => {
    const time = '2015-11-12T09:00:00+02:00';
    const expected = '2015-11-12T07:00:00.000Z';
    const state = getState(time);
    const actual = timeSelector(state);

    expect(actual).to.equal(expected);
  });

  it('should return undefined if time is not defined', () => {
    const state = getState();
    const actual = timeSelector(state);

    expect(actual).to.equal(undefined);
  });
});
