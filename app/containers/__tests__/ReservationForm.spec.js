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
    },
    date: '2015-10-11',
    isFetchingResource: false,
    timeSlots: Immutable([
      TimeSlot.build(),
      TimeSlot.build(),
    ]),
  };

  const tree = sd.shallowRender(<ReservationForm {...props} />);

  describe('rendering DatePicker', () => {
    const datePickerTrees = tree.everySubTree('DatePicker');
    const datePickerVdom = datePickerTrees[0].getRenderOutput();

    it('should render DatePicker component', () => {
      expect(datePickerTrees.length).to.equal(1);
    });

    it('should pass correct props to DatePicker component', () => {
      const actualProps = datePickerVdom.props;

      expect(actualProps.date).to.equal(props.date);
      expect(actualProps.onChange).to.equal(props.actions.changeReservationDate);
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
});
