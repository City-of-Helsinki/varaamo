import { expect } from 'chai';
import MockDate from 'mockdate';

import Immutable from 'seamless-immutable';

import reservationDateSelector from 'selectors/reservationDateSelector';

function getState(date) {
  return {
    ui: Immutable({
      reservation: {
        date,
      },
    }),
  };
}

describe('Selector: reservationDateSelector', () => {
  it('should return the date if it is defined', () => {
    const date = '2015-10-10';
    const state = getState(date);
    const actual = reservationDateSelector(state);

    expect(actual).to.equal(date);
  });

  it('should return current date string if date is not defined', () => {
    const state = getState('');
    MockDate.set('2015-12-24T12:00:00Z');
    const actual = reservationDateSelector(state);
    MockDate.reset();
    const expected = '2015-12-24';

    expect(actual).to.equal(expected);
  });
});
