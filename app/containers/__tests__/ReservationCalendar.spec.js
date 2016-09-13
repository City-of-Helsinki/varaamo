import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import TimeSlot from 'fixtures/TimeSlot';
import {
  UnconnectedReservationCalendar as ReservationCalendar,
} from 'containers/ReservationCalendar';

function getProps(props = {}) {
  const defaults = {
    actions: {
      addNotification: simple.stub(),
      cancelReservationEdit: simple.stub(),
      clearReservations: simple.stub(),
      closeConfirmReservationModal: simple.stub(),
      deleteReservation: simple.stub(),
      openConfirmReservationModal: simple.stub(),
      postReservation: simple.stub(),
      updatePath: simple.stub(),
      putReservation: simple.stub(),
      toggleTimeSlot: simple.stub(),
    },
    confirmReservationModalIsOpen: false,
    date: '2015-10-11',
    id: 'r-1',
    isFetchingResource: false,
    isLoggedIn: true,
    isMakingReservations: false,
    reservationsToEdit: [],
    resource: Resource.build({ needManualConfirmation: false }),
    timeSlots: [],
    selected: [],
    selectedReservations: [],
    staffUnits: [],
    urlHash: '',
  };

  return Object.assign({}, defaults, props);
}

function setup(setupProps = {}) {
  const props = getProps(setupProps);
  const tree = sd.shallowRender(<ReservationCalendar {...props} />);
  const instance = tree.getMountedInstance();

  return { props, tree, instance };
}

describe('Container: ReservationCalendar', () => {
  describe('render', () => {
    const timeSlots = [
      TimeSlot.build(),
      TimeSlot.build(),
    ];
    const setupProps = getProps({
      timeSlots: Immutable(timeSlots),
      selected: [timeSlots[0].asISOString, timeSlots[1].asISOString],
      selectedReservations: [
        Reservation.build(),
        Reservation.build(),
      ],
    });

    const { props, tree, instance } = setup(setupProps);

    describe('rendering Calendar', () => {
      const calendarTrees = tree.everySubTree('Calendar');

      it('should render Calendar component', () => {
        expect(calendarTrees.length).to.equal(1);
      });

      it('should pass correct props to Calendar component', () => {
        const actualProps = calendarTrees[0].props;

        expect(actualProps.date).to.equal(props.date);
        expect(actualProps.onChange).to.equal(instance.onDateChange);
      });
    });

    describe('rendering DateHeaderComponent', () => {
      const dateHeaderTrees = tree.everySubTree('DateHeaderComponent');

      it('should render DateHeaderComponent', () => {
        expect(dateHeaderTrees.length).to.equal(1);
      });

      it('should pass correct props to DateHeaderComponent', () => {
        const actualProps = dateHeaderTrees[0].props;

        expect(actualProps.date).to.equal(props.date);
        expect(actualProps.onChange).to.equal(instance.onDateChange);
      });
    });

    describe('rendering TimeSlots', () => {
      const timeSlotsTrees = tree.everySubTree('TimeSlots');

      it('should render TimeSlots component', () => {
        expect(timeSlotsTrees.length).to.equal(1);
      });

      it('should pass correct props to TimeSlots component', () => {
        const actualProps = timeSlotsTrees[0].props;

        expect(actualProps.addNotification).to.deep.equal(props.actions.addNotification);
        expect(actualProps.isAdmin).to.exist;
        expect(actualProps.isEditing).to.exist;
        expect(actualProps.isFetching).to.equal(props.isFetchingResource);
        expect(actualProps.isLoggedIn).to.equal(props.isLoggedIn);
        expect(actualProps.isStaff).to.exist;
        expect(actualProps.onClick).to.deep.equal(props.actions.toggleTimeSlot);
        expect(actualProps.resource).to.equal(props.resource);
        expect(actualProps.selected).to.deep.equal(props.selected);
        expect(actualProps.slots).to.deep.equal(props.timeSlots);
      });
    });

    describe('rendering ReservationCalendarControls', () => {
      const reservationCalendarControlsTrees = tree.everySubTree('ReservationCalendarControls');

      it('should render ReservationCalendarControls component', () => {
        expect(reservationCalendarControlsTrees.length).to.equal(1);
      });

      it('should pass correct props to ReservationCalendarControls component', () => {
        const actualProps = reservationCalendarControlsTrees[0].props;

        expect(actualProps.disabled).to.equal(false);
        expect(actualProps.isEditing).to.exist;
        expect(actualProps.isMakingReservations).to.equal(props.isMakingReservations);
        expect(actualProps.onCancel).to.equal(instance.handleEditCancel);
        expect(actualProps.onClick).to.equal(props.actions.openConfirmReservationModal);
      });
    });

    describe('rendering ConfirmReservationModal', () => {
      const modalTrees = tree.everySubTree('ConfirmReservationModal');

      it('should render ConfirmReservationModal component', () => {
        expect(modalTrees.length).to.equal(1);
      });

      it('should pass correct props to ConfirmReservationModal component', () => {
        const actualProps = modalTrees[0].props;

        expect(actualProps.isAdmin).to.exist;
        expect(actualProps.isEditing).to.exist;
        expect(actualProps.isMakingReservations).to.equal(props.isMakingReservations);
        expect(actualProps.isPreliminaryReservation)
          .to.equal(props.resource.needManualConfirmation);
        expect(actualProps.isStaff).to.exist;
        expect(actualProps.onClose).to.equal(props.actions.closeConfirmReservationModal);
        expect(actualProps.onConfirm).to.equal(instance.handleReservation);
        expect(actualProps.reservationsToEdit).to.deep.equal(props.reservationsToEdit);
        expect(actualProps.selectedReservations).to.deep.equal(props.selectedReservations);
        expect(actualProps.show).to.equal(props.confirmReservationModalIsOpen);
      });
    });
  });

  describe('on componentWillUnmount', () => {
    const { props, instance } = setup();
    instance.componentWillUnmount();

    it('should call clearReservations', () => {
      expect(props.actions.clearReservations.callCount).to.equal(1);
    });
  });

  describe('onDateChange', () => {
    const { props, instance } = setup();
    const newDate = '2015-12-24';
    instance.onDateChange(newDate);

    it('should call updatePath and update the url with the new date', () => {
      const actualUrl = props.actions.updatePath.lastCall.args[0];
      const expectedUrl = `/resources/${props.id}/reservation?date=${newDate}`;

      expect(props.actions.updatePath.callCount).to.equal(1);
      expect(actualUrl).to.equal(expectedUrl);
    });
  });

  describe('handleEdit', () => {
    describe('if no reservations are selected', () => {
      const setupProps = {
        selectedReservations: [],
        reservationsToEdit: [Reservation.build()],
      };
      const { props, instance } = setup(setupProps);
      instance.handleEdit();

      it('should delete the reservation that was edited', () => {
        const actualArgs = props.actions.deleteReservation.lastCall.args;

        expect(props.actions.deleteReservation.callCount).to.equal(1);
        expect(actualArgs[0]).to.equal(props.reservationsToEdit[0]);
      });
    });

    describe('if reservations are selected', () => {
      const setupProps = {
        selectedReservations: [
          Reservation.build(),
          Reservation.build(),
          Reservation.build(),
        ],
        reservationsToEdit: [Reservation.build()],
      };
      const { props, instance } = setup(setupProps);
      instance.handleEdit();

      it('should edit the first selected reservation', () => {
        const actualArgs = props.actions.putReservation.lastCall.args;
        const expectedReservation = Object.assign(
          {},
          props.selectedReservations[0],
          { url: props.reservationsToEdit[0].url }
        );

        expect(props.actions.putReservation.callCount).to.equal(1);
        expect(actualArgs[0]).to.deep.equal(expectedReservation);
      });

      it('should add new reservations for the rest of the selected reservations', (done) => {
        const expectedCallCount = props.selectedReservations.length - 1;

        setTimeout(() => {
          expect(props.actions.postReservation.callCount).to.equal(expectedCallCount);
          props.actions.postReservation.calls.forEach((call, index) => {
            expect(call.args[0]).to.deep.equal(props.selectedReservations[index + 1]);
          });
          done();
        }, 800);
      });
    });
  });

  describe('handleEditCancel', () => {
    const { props, instance } = setup();
    instance.handleEditCancel();

    it('should call cancelReservationEdit', () => {
      expect(props.actions.cancelReservationEdit.callCount).to.equal(1);
    });
  });

  describe('handleReservation', () => {
    const setupProps = {
      selectedReservations: [
        Reservation.build(),
        Reservation.build(),
      ],
    };
    const { props, instance } = setup(setupProps);

    it('should call postReservation for each selected reservation', () => {
      instance.handleReservation();
      expect(props.actions.postReservation.callCount).to.equal(props.selectedReservations.length);
    });

    it('should call postReservation with correct arguments', () => {
      instance.handleReservation();
      const actualArgs = props.actions.postReservation.lastCall.args;
      const expected = props.selectedReservations[1];

      expect(actualArgs[0]).to.deep.equal(expected);
    });

    it('should add given values to the reservation', () => {
      const values = { comments: 'Some random comment' };
      instance.handleReservation(values);
      const actualArgs = props.actions.postReservation.lastCall.args;

      expect(actualArgs[0].comments).to.equal(values.comments);
    });
  });
});
