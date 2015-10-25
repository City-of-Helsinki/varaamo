import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import selectedReservationsSelector from 'selectors/selectedReservationsSelector';

function getState(selected) {
  return {
    router: {
      params: {
        id: 'some-id',
      },
    },
    ui: Immutable({
      reservation: {
        selected,
      },
    }),
  };
}

describe('Selector: selectedReservationsSelector', () => {
  const selected = [
    '2015-12-12T12:00:00+03:00/2015-12-12T13:00:00+03:00',
    '2015-12-12T13:00:00+03:00/2015-12-12T14:00:00+03:00',
  ];

  it('should return an empty object if no reservations are selected', () => {
    const state = getState([]);
    const actual = selectedReservationsSelector(state);

    expect(actual).to.deep.equal([]);
  });

  it('should return selectedReservations in correct form', () => {
    const state = getState([selected[0]]);
    const actual = selectedReservationsSelector(state);
    const expected = [
      {
        begin: '2015-12-12T12:00:00+03:00',
        end: '2015-12-12T13:00:00+03:00',
        resource: 'some-id',
      },
    ];

    expect(actual).to.deep.equal(expected);
  });

  it('should combine reservations that if they are continual', () => {
    const state = getState(selected);
    const actual = selectedReservationsSelector(state);
    const expected = [
      {
        begin: '2015-12-12T12:00:00+03:00',
        end: '2015-12-12T14:00:00+03:00',
        resource: 'some-id',
      },
    ];

    expect(actual).to.deep.equal(expected);
  });
});
