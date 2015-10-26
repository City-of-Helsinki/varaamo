import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Reservation from 'fixtures/Reservation';
import sortedReservationsSelector from 'selectors/sortedReservationsSelector';

function getState(reservations = []) {
  return {
    data: Immutable({
      reservations: _.indexBy(reservations, 'url'),
    }),
  };
}

describe('Selector: sortedReservationsSelector', () => {
  it('should return an empty string if there are no reservations in state', () => {
    const state = getState([]);
    const actual = sortedReservationsSelector(state);

    expect(actual).to.deep.equal([]);
  });

  it('should return all reservations in state in an array', () => {
    const reservations = [
      Reservation.build(),
      Reservation.build(),
    ];
    const state = getState(reservations);
    const actual = sortedReservationsSelector(state);

    expect(actual.length).to.deep.equal(reservations.length);
  });

  it('should return the results ordered from newest to oldest', () => {
    const reservations = [
      Reservation.build({ begin: '2015-10-10' }),
      Reservation.build({ begin: '2015-09-20' }),
      Reservation.build({ begin: '2015-10-30' }),
    ];
    const state = getState(reservations);
    const actual = sortedReservationsSelector(state);
    const expected = [reservations[2], reservations[0], reservations[1]];

    expect(actual).to.deep.equal(expected);
  });
});
