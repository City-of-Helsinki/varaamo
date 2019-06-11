import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Reservation from '../../../utils/fixtures/Reservation';
import Resource from '../../../utils/fixtures/Resource';
import { getEditReservationUrl } from '../../../utils/reservationUtils';
import ReservationControls from '../ReservationControls';
import { UnconnectedReservationControlsContainer as ReservationControlsContainer } from '../ReservationControlsContainer';

describe('shared/reservation-controls/ReservationControlsContainer', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({ resource: resource.id });
  const history = {
    push: () => {},
  };
  const props = {
    history,
    actions: {
      confirmPreliminaryReservation: simple.stub(),
      denyPreliminaryReservation: simple.stub(),
      openConfirmReservationModal: simple.stub(),
      openReservationCancelModal: simple.stub(),
      selectReservationToCancel: simple.stub(),
      selectReservationToEdit: simple.stub(),
      selectReservationToShow: simple.stub(),
      showReservationInfoModal: simple.stub(),
    },
    isAdmin: false,
    isStaff: false,
    reservation,
    resource,
  };

  let container;
  let instance;

  beforeAll(() => {
    container = shallow(<ReservationControlsContainer {...props} />);
    instance = container.instance();
  });

  describe('rendering', () => {
    test('renders ReservationControls component', () => {
      expect(container.find(ReservationControls)).toHaveLength(1);
    });

    test('passes correct props to ReservationControls component', () => {
      const actualProps = container.find(ReservationControls).props();

      expect(actualProps.isAdmin).toBe(props.isAdmin);
      expect(actualProps.isStaff).toBe(props.isStaff);
      expect(actualProps.onCancelClick).toBe(instance.handleCancelClick);
      expect(actualProps.onConfirmClick).toBe(instance.handleConfirmClick);
      expect(actualProps.onDenyClick).toBe(instance.handleDenyClick);
      expect(actualProps.onEditClick).toBe(instance.handleEditClick);
      expect(actualProps.onInfoClick).toBe(instance.handleInfoClick);
      expect(actualProps.reservation).toBe(props.reservation);
    });
  });

  describe('handleCancelClick', () => {
    beforeAll(() => {
      instance.handleCancelClick();
    });

    test(
      'calls props.actions.selectReservationToCancel with this reservation',
      () => {
        expect(props.actions.selectReservationToCancel.callCount).toBe(1);
        expect(props.actions.selectReservationToCancel.lastCall.args[0]).toEqual(props.reservation);
      }
    );

    test('calls the props.actions.openReservationCancelModal function', () => {
      expect(props.actions.openReservationCancelModal.callCount).toBe(1);
    });
  });

  describe('handleEditClick', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
      instance.handleEditClick();
    });

    afterAll(() => {
      simple.restore();
    });

    test(
      'calls props.actions.selectReservationToEdit with reservation and slotSize',
      () => {
        expect(props.actions.selectReservationToEdit.callCount).toBe(1);
        expect(props.actions.selectReservationToEdit.lastCall.args[0]).toEqual({
          reservation: props.reservation,
          slotSize: props.resource.slotSize,
        });
      }
    );

    test('calls history.push with correct path', () => {
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = getEditReservationUrl(props.reservation);

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleInfoClick', () => {
    beforeAll(() => {
      instance.handleInfoClick();
    });

    test(
      'calls the props.actions.showReservationInfoModal function with this reservation',
      () => {
        expect(props.actions.showReservationInfoModal.callCount).toBe(1);
        expect(props.actions.showReservationInfoModal.lastCall.args[0]).toEqual(props.reservation);
      }
    );
  });
});
