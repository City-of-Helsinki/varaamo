import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';
import toJSON from 'enzyme-to-json';

import ReservationCancelModal from '../../../../../src/domain/reservation/modal/ReservationCancelModal';
import CompactReservationList from '../../../compact-reservation-list/CompactReservationList';
import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import { shallowWithIntl } from '../../../../utils/testUtils';
import {
  UnconnectedReservationCancelModalContainer as ReservationCancelModalContainer,
} from '../ReservationCancelModalContainer';

describe('shared/modals/reservation-cancel/ReservationCancelModalContainer', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({ resource: resource.id });
  const defaultProps = {
    actions: {
      closeReservationCancelModal: () => null,
      deleteReservation: () => null,
    },
    cancelAllowed: false,
    isCancellingReservations: false,
    reservation,
    resource,
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationCancelModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a Modal component', () => {
      const modalComponent = getWrapper().find(ReservationCancelModal);
      expect(modalComponent.length).toBe(1);
    });
  });

  describe('handleCancel', () => {
    const closeReservationCancelModal = simple.mock();
    const deleteReservation = simple.mock();
    const actions = { closeReservationCancelModal, deleteReservation };

    beforeAll(() => {
      const instance = getWrapper({ actions }).instance();
      instance.handleCancel();
    });

    test('calls deleteReservation with the reservation', () => {
      expect(deleteReservation.callCount).toBe(1);
      expect(deleteReservation.lastCall.arg).toEqual(defaultProps.reservation);
    });

    test('closes the ReservationCancelModal', () => {
      expect(closeReservationCancelModal.callCount).toBe(1);
    });
  });
});
