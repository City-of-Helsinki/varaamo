import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import selectedReservationsSelector from 'state/selectors/selectedReservationsSelector';

function getState(selected) {
  return {
    ui: Immutable({
      reservations: {
        selected,
      },
    }),
  };
}

function getProps() {
  return {
    params: {
      id: 'some-id',
    },
  };
}

describe('Selector: selectedReservationsSelector', () => {
  const selected = [
    '2015-12-12T12:00:00+03:00/2015-12-12T13:00:00+03:00',
    '2015-12-12T13:00:00+03:00/2015-12-12T14:00:00+03:00',
  ];

  it('returns an empty object if no reservations are selected', () => {
    const state = getState([]);
    const props = getProps();
    const actual = selectedReservationsSelector(state, props);

    expect(actual).to.deep.equal([]);
  });

  it('returns selectedReservations in correct form', () => {
    const state = getState([selected[0]]);
    const props = getProps();
    const actual = selectedReservationsSelector(state, props);
    const expected = [
      {
        begin: '2015-12-12T12:00:00+03:00',
        end: '2015-12-12T13:00:00+03:00',
        resource: 'some-id',
      },
    ];

    expect(actual).to.deep.equal(expected);
  });

  it('combines reservations that if they are continual', () => {
    const state = getState(selected);
    const props = getProps();
    const actual = selectedReservationsSelector(state, props);
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
