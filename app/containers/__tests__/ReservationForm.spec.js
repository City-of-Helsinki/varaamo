import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Reservation from 'fixtures/Reservation';
import TimeSlot from 'fixtures/TimeSlot';
import { UnconnectedReservationForm as ReservationForm } from 'containers/ReservationForm';

function getProps(props = {}) {
  const defaults = {
    actions: {
      cancelReservationEdit: simple.stub(),
      clearReservations: simple.stub(),
      closeConfirmReservationModal: simple.stub(),
      deleteReservation: simple.stub(),
      fetchResource: simple.stub(),
      postReservation: simple.stub(),
      putReservation: simple.stub(),
      pushState: simple.stub(),
      openConfirmReservationModal: simple.stub(),
      toggleTimeSlot: simple.stub(),
    },
    confirmReservationModalIsOpen: false,
    date: '2015-10-11',
    id: 'r-1',
    isFetchingResource: false,
    isLoggedIn: true,
    isMakingReservations: false,
    reservationsToEdit: [],
    timeSlots: [],
    selected: [],
    selectedReservations: [],
  };

  return Object.assign({}, defaults, props);
}

function setup(setupProps = {}) {
  const props = getProps(setupProps);
  const tree = sd.shallowRender(<ReservationForm {...props} />);
  const instance = tree.getMountedInstance();

  return { props, tree, instance };
}

describe('Container: ReservationForm', () => {
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

    describe('rendering DatePicker', () => {
      const datePickerTrees = tree.everySubTree('DatePicker');

      it('should render DatePicker component', () => {
        expect(datePickerTrees.length).to.equal(1);
      });

      it('should pass correct props to DatePicker component', () => {
        const actualProps = datePickerTrees[0].props;

        expect(actualProps.date).to.equal(props.date);
        expect(actualProps.hideFooter).to.equal(true);
        expect(actualProps.onChange).to.equal(instance.onDateChange);
      });
    });

    describe('rendering DateHeader', () => {
      const dateHeaderTrees = tree.everySubTree('DateHeader');

      it('should render DateHeader component', () => {
        expect(dateHeaderTrees.length).to.equal(1);
      });

      it('should pass correct props to DateHeader component', () => {
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

        expect(actualProps.isFetching).to.equal(props.isFetchingResource);
        expect(actualProps.isLoggedIn).to.equal(props.isLoggedIn);
        expect(actualProps.onClick).to.deep.equal(props.actions.toggleTimeSlot);
        expect(actualProps.selected).to.deep.equal(props.selected);
        expect(actualProps.slots).to.deep.equal(props.timeSlots);
      });
    });

    describe('rendering ReservationFormControls', () => {
      const reservationFormControlsTrees = tree.everySubTree('ReservationFormControls');

      it('should render ReservationFormControls component', () => {
        expect(reservationFormControlsTrees.length).to.equal(1);
      });

      it('should pass correct props to ReservationFormControls component', () => {
        const actualProps = reservationFormControlsTrees[0].props;

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

        expect(actualProps.isEditing).to.exist;
        expect(actualProps.isMakingReservations).to.equal(props.isMakingReservations);
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

    it('should call pushState and update the url with the new date', () => {
      const actualArgs = props.actions.pushState.lastCall.args;

      expect(props.actions.pushState.callCount).to.equal(1);
      expect(actualArgs[0]).to.equal(null);
      expect(actualArgs[1]).to.equal(`/resources/${props.id}/reservation`);
      expect(actualArgs[2]).to.deep.equal({ date: newDate });
    });

    it('should call fetchResource actionCreator', () => {
      expect(props.actions.fetchResource.callCount).to.equal(1);
    });

    it('should call fetchResource with correct arguments', () => {
      const actualArgs = props.actions.fetchResource.lastCall.args;

      expect(actualArgs[0]).to.equal(props.id);
      expect(actualArgs[1].start).to.contain(newDate);
      expect(actualArgs[1].end).to.contain(newDate);
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

      it('should redirect user back to my reservations page', () => {
        const actualUrlArg = props.actions.pushState.lastCall.args[1];
        const expected = '/my-reservations';

        expect(actualUrlArg).to.deep.equal(expected);
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

      it('should add new reservations for the rest of the selected reservations', () => {
        const expectedCallCount = props.selectedReservations.length - 1;

        expect(props.actions.postReservation.callCount).to.equal(expectedCallCount);
        props.actions.postReservation.calls.forEach((call, index) => {
          expect(call.args[0]).to.deep.equal(props.selectedReservations[index + 1]);
        });
      });

      it('should redirect user back to my reservations page', () => {
        const actualUrlArg = props.actions.pushState.lastCall.args[1];
        const expected = '/my-reservations';

        expect(actualUrlArg).to.deep.equal(expected);
      });
    });
  });

  describe('handleEditCancel', () => {
    const { props, instance } = setup();
    instance.handleEditCancel();

    it('should call cancelReservationEdit', () => {
      expect(props.actions.cancelReservationEdit.callCount).to.equal(1);
    });

    it('should redirect user back to my reservations page', () => {
      const actualUrlArg = props.actions.pushState.lastCall.args[1];
      const expected = '/my-reservations';

      expect(actualUrlArg).to.deep.equal(expected);
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
    instance.handleReservation();

    it('should call postReservation for each selected reservation', () => {
      expect(props.actions.postReservation.callCount).to.equal(props.selectedReservations.length);
    });

    it('should call postReservation with correct arguments', () => {
      const actualArgs = props.actions.postReservation.lastCall.args;
      const expected = props.selectedReservations[1];

      expect(actualArgs[0]).to.deep.equal(expected);
    });
  });
});
