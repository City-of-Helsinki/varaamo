import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import sortedReservationsSelector from 'state/selectors/sortedReservationsSelector';
import Reservation from 'utils/fixtures/Reservation';

function getState(reservations = []) {
  return {
    data: Immutable({
      reservations: keyBy(reservations, 'url'),
    }),
  };
}

describe('Selector: sortedReservationsSelector', () => {
  describe('if there is no filter in props', () => {
    it('returns an empty array if there are no reservations in state', () => {
      const state = getState([]);
      const props = {};
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([]);
    });

    it('returns all reservations in state in an array', () => {
      const reservations = [
        Reservation.build(),
        Reservation.build(),
      ];
      const state = getState(reservations);
      const props = {};
      const actual = sortedReservationsSelector(state, props);

      expect(actual.length).to.equal(reservations.length);
    });

    it('returns the results ordered from oldest to newest', () => {
      const reservations = [
        Reservation.build({ begin: '2015-10-10' }),
        Reservation.build({ begin: '2015-09-20' }),
        Reservation.build({ begin: '2015-10-30' }),
      ];
      const state = getState(reservations);
      const props = {};
      const actual = sortedReservationsSelector(state, props);
      const expected = [reservations[1], reservations[0], reservations[2]];

      expect(actual).to.deep.equal(expected);
    });
  });

  describe('if there is a filter in props', () => {
    it('returns an empty array if there are no reservations in state', () => {
      const state = getState([]);
      const props = { filter: 'preliminary' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([]);
    });

    describe('when filter is "cancelled"', () => {
      const props = { filter: 'cancelled' };

      it('returns only preliminary reservations in cancelled state', () => {
        const reservations = [
          Reservation.build({ state: 'cancelled', needManualConfirmation: true }),
          Reservation.build({ state: 'confirmed', needManualConfirmation: true }),
          Reservation.build({ state: 'cancelled', needManualConfirmation: false }),
          Reservation.build({ state: 'confirmed', needManualConfirmation: false }),
        ];
        const state = getState(reservations);
        const actual = sortedReservationsSelector(state, props);

        expect(actual).to.deep.equal([reservations[0]]);
      });
    });

    describe('when filter is "confirmed"', () => {
      const props = { filter: 'confirmed' };

      it('returns only preliminary reservations in confirmed state', () => {
        const reservations = [
          Reservation.build({ state: 'confirmed', needManualConfirmation: true }),
          Reservation.build({ state: 'cancelled', needManualConfirmation: true }),
          Reservation.build({ state: 'confirmed', needManualConfirmation: false }),
          Reservation.build({ state: 'cancelled', needManualConfirmation: false }),
        ];
        const state = getState(reservations);
        const actual = sortedReservationsSelector(state, props);

        expect(actual).to.deep.equal([reservations[0]]);
      });
    });

    describe('when filter is "denied"', () => {
      const props = { filter: 'denied' };

      it('returns only preliminary reservations in denied state', () => {
        const reservations = [
          Reservation.build({ state: 'denied', needManualConfirmation: true }),
          Reservation.build({ state: 'cancelled', needManualConfirmation: true }),
          Reservation.build({ state: 'denied', needManualConfirmation: false }),
          Reservation.build({ state: 'cancelled', needManualConfirmation: false }),
        ];
        const state = getState(reservations);
        const actual = sortedReservationsSelector(state, props);

        expect(actual).to.deep.equal([reservations[0]]);
      });
    });

    describe('when filter is "requested"', () => {
      const props = { filter: 'requested' };

      it('returns only preliminary reservations in requested state', () => {
        const reservations = [
          Reservation.build({ state: 'requested', needManualConfirmation: true }),
          Reservation.build({ state: 'cancelled', needManualConfirmation: true }),
          Reservation.build({ state: 'requested', needManualConfirmation: false }),
          Reservation.build({ state: 'cancelled', needManualConfirmation: false }),
        ];
        const state = getState(reservations);
        const actual = sortedReservationsSelector(state, props);

        expect(actual).to.deep.equal([reservations[0]]);
      });
    });

    it('returns only preliminary reservations when filter is "all"', () => {
      const reservations = [
        Reservation.build({ needManualConfirmation: true }),
        Reservation.build({ needManualConfirmation: false }),
      ];
      const state = getState(reservations);
      const props = { filter: 'all' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[0]]);
    });

    it('returns only preliminary reservations when filter is "preliminary"', () => {
      const reservations = [
        Reservation.build({ needManualConfirmation: true }),
        Reservation.build({ needManualConfirmation: false }),
      ];
      const state = getState(reservations);
      const props = { filter: 'preliminary' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[0]]);
    });

    it('returns only regular reservations when filter is "regular"', () => {
      const reservations = [
        Reservation.build({ needManualConfirmation: true }),
        Reservation.build({ needManualConfirmation: false }),
      ];
      const state = getState(reservations);
      const props = { filter: 'regular' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[1]]);
    });

    it('returns all reservations when filter is anything else', () => {
      const reservations = [
        Reservation.build({ needManualConfirmation: true }),
        Reservation.build({ needManualConfirmation: false }),
      ];
      const state = getState(reservations);
      const props = { filter: 'whatever' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual.length).to.equal(reservations.length);
    });

    it('returns the results ordered from oldest to newest', () => {
      const reservations = [
        Reservation.build({ begin: '2015-10-10', needManualConfirmation: true }),
        Reservation.build({ begin: '2015-09-20', needManualConfirmation: true }),
        Reservation.build({ begin: '2015-10-30', needManualConfirmation: true }),
      ];
      const state = getState(reservations);
      const props = { filter: 'preliminary' };
      const actual = sortedReservationsSelector(state, props);
      const expected = [reservations[1], reservations[0], reservations[2]];

      expect(actual).to.deep.equal(expected);
    });
  });
});
