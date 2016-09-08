import { expect } from 'chai';

import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import Reservation from 'fixtures/Reservation';
import sortedReservationsSelector from 'selectors/sortedReservationsSelector';

function getState(reservations = []) {
  return {
    data: Immutable({
      reservations: keyBy(reservations, 'url'),
    }),
  };
}

describe('Selector: sortedReservationsSelector', () => {
  describe('if there is no filter in props', () => {
    it('should return an empty string if there are no reservations in state', () => {
      const state = getState([]);
      const props = {};
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([]);
    });

    it('should return all reservations in state in an array', () => {
      const reservations = [
        Reservation.build(),
        Reservation.build(),
      ];
      const state = getState(reservations);
      const props = {};
      const actual = sortedReservationsSelector(state, props);

      expect(actual.length).to.equal(reservations.length);
    });

    it('should return the results ordered from oldest to newest', () => {
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
    it('should return an empty string if there are no reservations in state', () => {
      const state = getState([]);
      const props = { filter: 'preliminary' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([]);
    });

    it('should return only reservations in cancelled state when filter is "cancelled"', () => {
      const reservations = [
        Reservation.build({ state: 'cancelled' }),
        Reservation.build({ state: 'confirmed' }),
      ];
      const state = getState(reservations);
      const props = { filter: 'cancelled' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[0]]);
    });

    it('should return only reservations in confirmed state when filter is "confirmed"', () => {
      const reservations = [
        Reservation.build({ state: 'confirmed' }),
        Reservation.build({ state: 'requested' }),
      ];
      const state = getState(reservations);
      const props = { filter: 'confirmed' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[0]]);
    });

    it('should return only reservations in denied state when filter is "denied"', () => {
      const reservations = [
        Reservation.build({ state: 'denied' }),
        Reservation.build({ state: 'requested' }),
      ];
      const state = getState(reservations);
      const props = { filter: 'denied' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[0]]);
    });

    it('should return only reservations in requested state when filter is "requested"', () => {
      const reservations = [
        Reservation.build({ state: 'requested' }),
        Reservation.build({ state: 'confirmed' }),
      ];
      const state = getState(reservations);
      const props = { filter: 'requested' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[0]]);
    });

    it('should return only preliminary reservations when filter is "all"', () => {
      const reservations = [
        Reservation.build({ needManualConfirmation: true }),
        Reservation.build({ needManualConfirmation: false }),
      ];
      const state = getState(reservations);
      const props = { filter: 'all' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[0]]);
    });

    it('should return only preliminary reservations when filter is "preliminary"', () => {
      const reservations = [
        Reservation.build({ needManualConfirmation: true }),
        Reservation.build({ needManualConfirmation: false }),
      ];
      const state = getState(reservations);
      const props = { filter: 'preliminary' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[0]]);
    });

    it('should return only regular reservations when filter is "regular"', () => {
      const reservations = [
        Reservation.build({ needManualConfirmation: true }),
        Reservation.build({ needManualConfirmation: false }),
      ];
      const state = getState(reservations);
      const props = { filter: 'regular' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual).to.deep.equal([reservations[1]]);
    });

    it('should return all reservations when filter is anything else', () => {
      const reservations = [
        Reservation.build({ needManualConfirmation: true }),
        Reservation.build({ needManualConfirmation: false }),
      ];
      const state = getState(reservations);
      const props = { filter: 'whatever' };
      const actual = sortedReservationsSelector(state, props);

      expect(actual.length).to.equal(reservations.length);
    });

    it('should return the results ordered from oldest to newest', () => {
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
