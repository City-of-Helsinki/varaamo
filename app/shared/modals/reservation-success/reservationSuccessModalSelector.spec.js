import ModalTypes from 'constants/ModalTypes';

import { expect } from 'chai';
import { getState } from 'utils/testUtils';

import reservationSuccessModalSelector from './reservationSuccessModalSelector';

describe('shared/modals/reservation-success/reservationSuccessModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return reservationSuccessModalSelector(state);
  }

  it('returns reservationsToShow from the state ordered by begin time', () => {
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
    expect(selected.reservationsToShow).to.deep.equal(expected);
  });

  it('returns failedReservations from the state ordered by begin time', () => {
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
    expect(selected.failedReservations).to.deep.equal(expected);
  });

  it('returns resources from the state', () => {
    expect(getSelected().resources).to.exist;
  });

  describe('show', () => {
    it('returns true if modals.open contain RESERVATION_SUCCESS', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESERVATION_SUCCESS],
      });
      expect(selected.show).to.be.true;
    });

    it('returns false if modals.open does not contain RESERVATION_SUCCESS', () => {
      const selected = getSelected({
        'ui.modals.open': [],
      });
      expect(selected.show).to.be.false;
    });
  });

  it('returns user', () => {
    expect(getSelected().user).to.exist;
  });
});
