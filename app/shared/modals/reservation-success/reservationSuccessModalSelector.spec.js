import ModalTypes from 'constants/ModalTypes';

import { getState } from 'utils/testUtils';
import reservationSuccessModalSelector from './reservationSuccessModalSelector';

describe('shared/modals/reservation-success/reservationSuccessModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return reservationSuccessModalSelector(state);
  }

  test('returns reservationsToShow from the state ordered by begin time', () => {
    const reservationsToShow = [
      {
        id: 'r-1',
        begin: '2017-05-14T10:00:00.000Z',
        end: '2017-05-14T10:30:00.000Z',
      },
      {
        id: 'r-2',
        begin: '2017-05-12T12:00:00.000Z',
        end: '2017-05-12T12:30:00.000Z',
      },
      {
        id: 'r-3',
        begin: '2017-05-12T14:00:00.000Z',
        end: '2017-05-12T14:30:00.000Z',
      },
    ];
    const expected = [
      {
        id: 'r-2',
        begin: '2017-05-12T12:00:00.000Z',
        end: '2017-05-12T12:30:00.000Z',
      },
      {
        id: 'r-3',
        begin: '2017-05-12T14:00:00.000Z',
        end: '2017-05-12T14:30:00.000Z',
      },
      {
        id: 'r-1',
        begin: '2017-05-14T10:00:00.000Z',
        end: '2017-05-14T10:30:00.000Z',
      },
    ];
    const selected = getSelected({
      'ui.reservations.toShow': reservationsToShow,
    });
    expect(selected.reservationsToShow).toEqual(expected);
  });

  test('returns failedReservations from the state ordered by begin time', () => {
    const failedReservations = [
      {
        id: 'r-1',
        begin: '2017-05-14T10:00:00.000Z',
        end: '2017-05-14T10:30:00.000Z',
      },
      {
        id: 'r-2',
        begin: '2017-05-12T12:00:00.000Z',
        end: '2017-05-12T12:30:00.000Z',
      },
      {
        id: 'r-3',
        begin: '2017-05-12T14:00:00.000Z',
        end: '2017-05-12T14:30:00.000Z',
      },
    ];
    const expected = [
      {
        id: 'r-2',
        begin: '2017-05-12T12:00:00.000Z',
        end: '2017-05-12T12:30:00.000Z',
      },
      {
        id: 'r-3',
        begin: '2017-05-12T14:00:00.000Z',
        end: '2017-05-12T14:30:00.000Z',
      },
      {
        id: 'r-1',
        begin: '2017-05-14T10:00:00.000Z',
        end: '2017-05-14T10:30:00.000Z',
      },
    ];
    const selected = getSelected({
      'ui.reservations.failed': failedReservations,
    });
    expect(selected.failedReservations).toEqual(expected);
  });

  test('returns resources from the state', () => {
    expect(getSelected().resources).toBeDefined();
  });

  describe('show', () => {
    test('returns true if modals.open contain RESERVATION_SUCCESS', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESERVATION_SUCCESS],
      });
      expect(selected.show).toBe(true);
    });

    test(
      'returns false if modals.open does not contain RESERVATION_SUCCESS',
      () => {
        const selected = getSelected({
          'ui.modals.open': [],
        });
        expect(selected.show).toBe(false);
      }
    );
  });

  test('returns user', () => {
    expect(getSelected().user).toBeDefined();
  });
});
