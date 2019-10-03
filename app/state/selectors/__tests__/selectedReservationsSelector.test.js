import Immutable from 'seamless-immutable';

import selectedReservationsSelector from '../selectedReservationsSelector';

function getState(selected) {
  return {
    ui: Immutable({
      reservations: {
        selected,
      },
    }),
  };
}

describe('Selector: selectedReservationsSelector', () => {
  const selected = [{
    begin: '2015-12-12T12:00:00+03:00',
    end: '2015-12-12T13:00:00+03:00',
    resource: 'some-id',
  }, {
    begin: '2015-12-12T13:00:00+03:00',
    end: '2015-12-12T14:00:00+03:00',
    resource: 'some-id',
  }];

  test('returns an empty object if no reservations are selected', () => {
    const state = getState([]);
    const actual = selectedReservationsSelector(state);

    expect(actual).toEqual([]);
  });

  test('returns selectedReservations in correct form', () => {
    const state = getState([selected[0]]);
    const actual = selectedReservationsSelector(state);
    const expected = [
      {
        begin: '2015-12-12T12:00:00+03:00',
        end: '2015-12-12T13:00:00+03:00',
        resource: 'some-id',
      },
    ];

    expect(actual).toEqual(expected);
  });

  test('combines reservations that if they are continual', () => {
    const state = getState(selected);
    const actual = selectedReservationsSelector(state);
    const expected = [
      {
        begin: '2015-12-12T12:00:00+03:00',
        end: '2015-12-12T14:00:00+03:00',
        resource: 'some-id',
      },
    ];

    expect(actual).toEqual(expected);
  });
});
