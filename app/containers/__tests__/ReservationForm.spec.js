import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import TimeSlot from 'fixtures/TimeSlot';
import { UnconnectedReservationForm as ReservationForm } from 'containers/ReservationForm';

describe('Container: ReservationForm', () => {
  const props = {
    actions: {
      changeReservationDate: simple.stub(),
      fetchResource: simple.stub(),
    },
    date: '2015-10-11',
    id: 'r-1',
    isFetchingResource: false,
    timeSlots: Immutable([
      TimeSlot.build(),
      TimeSlot.build(),
    ]),
  };

  const tree = sd.shallowRender(<ReservationForm {...props} />);
  const instance = tree.getMountedInstance();

  describe('rendering DatePicker', () => {
    const datePickerTrees = tree.everySubTree('DatePicker');
    const datePickerVdom = datePickerTrees[0].getRenderOutput();

    it('should render DatePicker component', () => {
      expect(datePickerTrees.length).to.equal(1);
    });

    it('should pass correct props to DatePicker component', () => {
      const actualProps = datePickerVdom.props;

      expect(actualProps.date).to.equal(props.date);
      expect(actualProps.onChange).to.equal(instance.onDateChange);
    });
  });

  describe('rendering TimeSlots', () => {
    const timeSlotsTrees = tree.everySubTree('TimeSlots');
    const timeSlotsVdom = timeSlotsTrees[0].getRenderOutput();

    it('should render TimeSlots component', () => {
      expect(timeSlotsTrees.length).to.equal(1);
    });

    it('should pass correct props to TimeSlots component', () => {
      const actualProps = timeSlotsVdom.props;

      expect(actualProps.isFetching).to.equal(props.isFetchingResource);
      expect(actualProps.slots).to.deep.equal(props.timeSlots);
    });
  });

  describe('onDateChange', () => {
    const newDate = '2015-12-24';

    before(() => {
      instance.onDateChange(newDate);
    });

    it('should call changeReservationDate actionCreator', () => {
      expect(props.actions.changeReservationDate.callCount).to.equal(1);
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
});
