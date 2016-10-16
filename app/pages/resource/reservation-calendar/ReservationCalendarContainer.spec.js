import { expect } from 'chai';
import React from 'react';
import { browserHistory } from 'react-router';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Resource from 'utils/fixtures/Resource';
import TimeSlot from 'utils/fixtures/TimeSlot';
import { getResourcePageUrl } from 'utils/resourceUtils';
import {
  UnconnectedReservationCalendarContainer as ReservationCalendarContainer,
} from './ReservationCalendarContainer';

function getProps(props = {}) {
  const resource = Resource.build();
  const defaults = {
    actions: {
      addNotification: simple.stub(),
      cancelReservationEdit: simple.stub(),
      clearReservations: simple.stub(),
      openConfirmReservationModal: simple.stub(),
      toggleTimeSlot: simple.stub(),
    },
    date: '2015-10-11',
    isAdmin: false,
    isEditing: false,
    isFetchingResource: false,
    isLoggedIn: true,
    isMakingReservations: false,
    location: { hash: '&some=hash' },
    params: { id: resource.id },
    resource,
    selected: [],
    staffUnits: [],
    timeSlots: [],
    urlHash: '',
  };

  return Object.assign({}, defaults, props);
}

function setup(setupProps = {}) {
  const props = getProps(setupProps);
  const tree = sd.shallowRender(<ReservationCalendarContainer {...props} />);
  const instance = tree.getMountedInstance();

  return { props, tree, instance };
}

describe('pages/resource/reservation-calendar/ReservationCalendarContainer', () => {
  describe('render', () => {
    const timeSlots = [
      TimeSlot.build(),
      TimeSlot.build(),
    ];
    const setupProps = getProps({
      timeSlots: Immutable(timeSlots),
      selected: [timeSlots[0].asISOString, timeSlots[1].asISOString],
    });

    const { props, tree, instance } = setup(setupProps);

    describe('rendering Calendar', () => {
      const calendarTrees = tree.everySubTree('Calendar');

      it('renders Calendar component', () => {
        expect(calendarTrees.length).to.equal(1);
      });

      it('passes correct props to Calendar component', () => {
        const actualProps = calendarTrees[0].props;

        expect(actualProps.date).to.equal(props.date);
        expect(actualProps.onChange).to.equal(instance.onDateChange);
      });
    });

    describe('rendering DateHeader', () => {
      const dateHeaderTrees = tree.everySubTree('DateHeader');

      it('renders DateHeader', () => {
        expect(dateHeaderTrees.length).to.equal(1);
      });

      it('passes correct props to DateHeader', () => {
        const actualProps = dateHeaderTrees[0].props;

        expect(actualProps.date).to.equal(props.date);
        expect(actualProps.onDecreaseDateButtonClick).to.equal(instance.decreaseDate);
        expect(actualProps.onIncreaseDateButtonClick).to.equal(instance.increaseDate);
      });
    });

    describe('rendering TimeSlots', () => {
      const timeSlotsTrees = tree.everySubTree('TimeSlots');

      it('renders TimeSlots component', () => {
        expect(timeSlotsTrees.length).to.equal(1);
      });

      it('passes correct props to TimeSlots component', () => {
        const actualProps = timeSlotsTrees[0].props;

        expect(actualProps.addNotification).to.deep.equal(props.actions.addNotification);
        expect(actualProps.isAdmin).to.equal(props.isAdmin);
        expect(actualProps.isEditing).to.equal(props.isEditing);
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

      it('renders ReservationCalendarControls component', () => {
        expect(reservationCalendarControlsTrees.length).to.equal(1);
      });

      it('passes correct props to ReservationCalendarControls component', () => {
        const actualProps = reservationCalendarControlsTrees[0].props;

        expect(actualProps.disabled).to.equal(false);
        expect(actualProps.isEditing).to.equal(props.isEditing);
        expect(actualProps.isMakingReservations).to.equal(props.isMakingReservations);
        expect(actualProps.onCancel).to.equal(instance.handleEditCancel);
        expect(actualProps.onClick).to.equal(props.actions.openConfirmReservationModal);
      });
    });
  });

  describe('on componentWillUnmount', () => {
    const { props, instance } = setup();
    instance.componentWillUnmount();

    it('calls clearReservations', () => {
      expect(props.actions.clearReservations.callCount).to.equal(1);
    });
  });

  describe('onDateChange', () => {
    const newDate = '2015-12-24';
    const { props, instance } = setup();
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
      instance.onDateChange(newDate);
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.push with correct path', () => {
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = getResourcePageUrl(props.resource, newDate);

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });

  describe('handleEditCancel', () => {
    const { props, instance } = setup();
    instance.handleEditCancel();

    it('calls cancelReservationEdit', () => {
      expect(props.actions.cancelReservationEdit.callCount).to.equal(1);
    });
  });
});
