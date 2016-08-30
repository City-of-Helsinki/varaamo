import { expect } from 'chai';
import simple from 'simple-mock';

import apiUtils from 'utils/APIUtils';
import reservationActions from 'actions/reservationActions';

describe('Actions: reservationActions', () => {
  const reservation = {
    url: 'http://reservation.url',
    resource: '1234qwert',
  };

  let getRequestTypeDescriptorMock;
  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
  });

  describe('deleteReservation', () => {
    it('includes correct track in meta', () => {
      reservationActions.deleteReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
        event: 'trackEvent',
        args: [
          'Reservation',
          'cancel',
          reservation.resource,
        ],
      });
    });
  });
  describe('postReservation', () => {
    it('includes correct track in meta', () => {
      reservationActions.postReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
        event: 'trackEvent',
        args: [
          'Reservation',
          'add',
          reservation.resource,
        ],
      });
    });
  });
  describe('putReservation', () => {
    it('includes correct track in meta', () => {
      reservationActions.putReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
        event: 'trackEvent',
        args: [
          'Reservation',
          'edit',
          reservation.resource,
        ],
      });
    });
  });
});
