import { canUserModifyReservation, canUserCancelReservation, getShowRefundPolicy } from '../utils';
import reservationGenerator from '../../../common/data/fixtures/reservation';
import { RESERVATION_STATE } from '../../../constants/ReservationState';

describe('Reservation utils function ', () => {
  const reservationCreator = props => reservationGenerator.build(props);

  describe('canUserModifyReservation ', () => {
    test('return false as default if (logged in) user have no permission defined', () => {
      const reservation = reservationCreator();
      const canModify = canUserModifyReservation(reservation);

      expect(canModify).toBeFalsy();
    });

    test('return false if (logged in) user have can_modify false', () => {
      const reservation = reservationCreator({ can_modify: false });
      const canModify = canUserModifyReservation(reservation);

      expect(canModify).toBeFalsy();
    });

    test('return false if (logged in) user have can_modify true, but reservation state was canceled', () => {
      const reservation = reservationCreator({ can_modify: true, state: RESERVATION_STATE.CANCELLED });
      const canModify = canUserModifyReservation(reservation);

      expect(canModify).toBeFalsy();
    });

    test('return true if (logged in) user have can_modify true, state not canceled', () => {
      const reservation = reservationCreator({ can_modify: true, state: RESERVATION_STATE.CONFIRMED });
      const canModify = canUserModifyReservation(reservation);

      expect(canModify).toBeFalsy();
    });
  });

  describe('canUserCancelReservation ', () => {
    test('return false as default if (logged in) user have no permission defined', () => {
      const reservation = reservationCreator();
      const canCancel = canUserCancelReservation(reservation);

      expect(canCancel).toBeFalsy();
    });

    test('return false if (logged in) user have can_delete false', () => {
      const reservation = reservationCreator({ can_delete: false });
      const canCancel = canUserCancelReservation(reservation);

      expect(canCancel).toBeFalsy();
    });

    test('return false if (logged in) user have can_delete true, but reservation state was canceled', () => {
      const reservation = reservationCreator({ can_delete: true, state: RESERVATION_STATE.CANCELLED });
      const canCancel = canUserCancelReservation(reservation);

      expect(canCancel).toBeFalsy();
    });

    test('return true if (logged in) user have can_delete true, state not canceled', () => {
      const reservation = reservationCreator({ can_delete: true, state: RESERVATION_STATE.CONFIRMED });
      const canCancel = canUserCancelReservation(reservation);

      expect(canCancel).toBeFalsy();
    });
  });

  describe('getShowRefundPolicy', () => {
    test('should return true when user is admin, reservation is not a staff event and reservation has a price', () => {
      const reservation = {
        staffEvent: false,
        begin: new Date(2017, 6, 7, 10, 0, 0, 0),
        end: new Date(2017, 6, 7, 11, 0, 0, 0),
      };
      const resource = {
        products: [
          {
            price: {
              type: 'per_period',
              period: '01:00',
              amount: 100,
            },
          },
        ],
      };

      expect(getShowRefundPolicy(true, reservation, resource));
    });
  });
});
