import { expect } from 'chai';
import timeSelector from 'state/selectors/timeSelector';

function getProps(time) {
  return {
    location: {
      search: time ? `?time=${time}` : ''
    }
  };
}

describe('Selector: timeSelector', () => {
  it('returns the time ISOString in utc time if time is defined', () => {
    const time = '2015-11-12 07:00:00.000';
    const expected = '2015-11-12T07:00:00.000Z';
    const state = {};
    const props = getProps(time);
    const actual = timeSelector(state, props);

    expect(actual).to.equal(expected);
  });

  it('returns undefined if time is not defined', () => {
    const state = {};
    const props = getProps();
    const actual = timeSelector(state, props);

    expect(actual).to.equal(undefined);
  });
});
